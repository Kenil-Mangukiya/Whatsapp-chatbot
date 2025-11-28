import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import config from "../config/config.js";
import { AuthUser } from "../db/index.js";
import { sendWhatsappOTP } from "../services/whatsapp.service.js";
import { storeOTP, verifyOTP } from "../utils/otpStore.js";
import { Op } from "sequelize";

// Generate JWT token with user data
const generateToken = (userId, phoneNumber, rememberMe = false) => {
    const payload = {
        _id: userId,
        phoneNumber: phoneNumber
    };
    
    // Token expires in 7 days minimum (or 30 days if remember me)
    const expiresIn = rememberMe ? "30d" : "7d";
    
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn
    });
};

// Extract OTP from WhatsApp response
const extractOTPFromResponse = (response) => {
    try {
        // OTP is in: newMessage.message.components[0].text
        // Format: "*647113* is your verification code."
        const text = response?.data?.newMessage?.message?.components?.[0]?.text;
        if (!text) {
            return null;
        }
        
        // Extract OTP between asterisks: *647113*
        const otpMatch = text.match(/\*(\d+)\*/);
        if (otpMatch && otpMatch[1]) {
            return otpMatch[1];
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting OTP:', error);
        return null;
    }
};

export const sendWhatsppOTP = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    console.log("phone number is : ", phoneNumber);
    
    if (!phoneNumber) {
        throw new apiError(400, "Phone number is required");
    }
    
    try {
        const response = await sendWhatsappOTP(phoneNumber);
        console.log("WhatsApp response from upmatrix is : ", JSON.stringify(response?.data, null, 2));
        
        // Extract OTP from response
        const extractedOtp = extractOTPFromResponse(response);
        
        if (extractedOtp) {
            // Log the OTP that was sent from upmatrix
            console.log("===========================================");
            console.log(`OTP sent from upmatrix for phone ${phoneNumber}: ${extractedOtp}`);
            console.log("===========================================");
            
            // Store OTP for validation
            storeOTP(phoneNumber, extractedOtp);
            console.log("OTP stored for phone number:", phoneNumber);
            
            return res.status(200).json(
                new apiResponse(200, "Whatsapp OTP sent successfully", { 
                    message: "OTP sent to your WhatsApp",
                    // Don't send OTP in response for security
                })
            );
        } else {
            console.error("Could not extract OTP from response:", JSON.stringify(response?.data, null, 2));
            throw new apiError(500, "Failed to extract OTP from response");
        }
    } catch (error) {
        console.log("error is : ", error);
        throw new apiError(500, "Something went wrong", error.message);
    }
});

// Login/Register endpoint - handles both new and existing users
export const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    
    console.log("Login request received for phone:", phoneNumber);
    
    // Validate input
    if (!phoneNumber) {
        throw new apiError(400, "Phone number is required");
    }
    
    if (!otp) {
        throw new apiError(400, "OTP is required");
    }
    
    // Verify OTP
    const otpVerification = verifyOTP(phoneNumber, otp);
    
    if (!otpVerification.valid) {
        // Return user-friendly error message based on error type
        const errorMessage = otpVerification.message || "Invalid or expired OTP";
        const statusCode = otpVerification.errorType === 'not_found' ? 404 : 400;
        throw new apiError(statusCode, errorMessage);
    }
    
    // Check if user exists
    let user = await AuthUser.findOne({
        where: { phoneNumber: phoneNumber }
    });
    
    // If user doesn't exist, create new user
    if (!user) {
        console.log("User not found, creating new user with phone:", phoneNumber);
        
        // Create new user with phone number only
        user = await AuthUser.create({
            phoneNumber: phoneNumber,
            username: `user_${phoneNumber}`, // Default username
            email: null // Will be set during setup
        });
        
        console.log("New user created:", user.id);
    } else {
        console.log("Existing user found:", user.id);
    }
    
    // Generate JWT token
    const token = generateToken(user.id, user.phoneNumber, false);
    
    // Set cookie with token
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('authToken', token, cookieOptions);
    
    // Return success response
    return res.status(200).json(
        new apiResponse(200, user ? "Login successful" : "Registration and login successful", {
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                username: user.username
            },
            message: user ? "Welcome back!" : "Account created successfully!"
        })
    );
});

// Save setup data (business details and pricing)
export const saveSetupData = asyncHandler(async (req, res) => {
    const userId = req.userId; // From authenticate middleware
    
    const {
        businessName,
        fullName,
        email,
        businessSize,
        serviceArea,
        startTime,
        endTime,
        vehicleTypes
    } = req.body;
    
    console.log("Save setup data request for user:", userId);
    
    // Validate required fields
    if (!businessName || !businessName.trim()) {
        throw new apiError(400, "Business name is required");
    }
    
    if (!fullName || !fullName.trim()) {
        throw new apiError(400, "Full name is required");
    }
    
    if (!serviceArea || !serviceArea.trim()) {
        throw new apiError(400, "Service area is required");
    }
    
    // Validate email format if provided
    if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new apiError(400, "Please provide a valid email address");
        }
    }
    
    // Find user
    const user = await AuthUser.findByPk(userId);
    
    if (!user) {
        throw new apiError(404, "User not found");
    }
    
    // Prepare update data
    const updateData = {
        businessName: businessName.trim(),
        fullName: fullName.trim(),
        serviceArea: serviceArea.trim()
    };
    
    // Add optional fields if provided
    if (email && email.trim()) {
        updateData.email = email.trim();
    }
    
    if (businessSize && businessSize.trim()) {
        updateData.businessSize = businessSize.trim();
    }
    
    if (startTime) {
        updateData.startTime = startTime;
    }
    
    if (endTime) {
        updateData.endTime = endTime;
    }
    
    // Always update vehicleTypes - send empty array if no vehicle types
    // This ensures deletions are properly saved
    if (vehicleTypes !== undefined) {
        if (Array.isArray(vehicleTypes)) {
            updateData.vehicleTypes = vehicleTypes.length > 0 ? vehicleTypes : null;
        } else {
            updateData.vehicleTypes = null;
        }
    }
    
    // Update user with setup data
    await user.update(updateData);
    
    console.log("Setup data saved successfully for user:", userId);
    
    // Return success response
    return res.status(200).json(
        new apiResponse(200, "Setup data saved successfully", {
            user: {
                id: user.id,
                businessName: user.businessName,
                fullName: user.fullName,
                email: user.email,
                businessSize: user.businessSize,
                serviceArea: user.serviceArea,
                startTime: user.startTime,
                endTime: user.endTime,
                vehicleTypes: user.vehicleTypes
            }
        })
    );
});

// Logout endpoint
export const logoutUser = asyncHandler(async (req, res) => {
    // Clear the auth token cookie
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    
    return res.status(200).json(
        new apiResponse(200, "Logged out successfully", {
            message: "You have been logged out successfully"
        })
    );
});

// Get all businesses (Admin endpoint)
export const getAllBusinesses = asyncHandler(async (req, res) => {
    try {
        const businesses = await AuthUser.findAll({
            attributes: [
                'id',
                'businessName',
                'phoneNumber',
                'fullName',
                'email',
                'businessSize',
                'serviceArea',
                'startTime',
                'endTime',
                'vehicleTypes',
                'assignedPhoneNumber',
                'createdAt',
                'updatedAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        // Format the data
        const formattedBusinesses = businesses.map(business => ({
            id: business.id,
            businessName: business.businessName || 'N/A',
            phoneNumber: business.phoneNumber || 'N/A',
            fullName: business.fullName || 'N/A',
            email: business.email || null,
            businessSize: business.businessSize || null,
            serviceArea: business.serviceArea || null,
            startTime: business.startTime || null,
            endTime: business.endTime || null,
            vehicleTypes: business.vehicleTypes || null,
            assignedPhoneNumber: business.assignedPhoneNumber || null,
            createdAt: business.createdAt,
            updatedAt: business.updatedAt
        }));

        return res.status(200).json(
            new apiResponse(200, "Businesses retrieved successfully", formattedBusinesses)
        );
    } catch (error) {
        console.error("Error fetching businesses:", error);
        throw new apiError(500, "Error retrieving businesses", error.message);
    }
});

// Utility function to format phone number
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null;
    
    // Remove all spaces and special characters except +
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // If already starts with +91, return as is
    if (cleaned.startsWith('+919')) {
        return cleaned;
    }
    
    // If starts with 919 (without +), add +
    if (cleaned.startsWith('919') && cleaned.length === 13) {
        return '+' + cleaned;
    }
    
    // If starts with 91 (without +) and length is 12, add +
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return '+' + cleaned;
    }
    
    // If it's a 10-digit number, add +91
    if (/^[6-9]\d{9}$/.test(cleaned)) {
        return '+91' + cleaned;
    }
    
    // If it's already in correct format, return as is
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
        return cleaned;
    }
    
    // Return null if format is invalid
    return null;
};

// Validate phone number format
const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return { valid: false, message: 'Phone number is required' };
    
    const formatted = formatPhoneNumber(phoneNumber);
    if (!formatted) {
        return { valid: false, message: 'Invalid phone number format. Please enter a valid 10-digit number or +91XXXXXXXXXX' };
    }
    
    // Check if it matches Indian mobile number pattern
    if (!/^\+91[6-9]\d{9}$/.test(formatted)) {
        return { valid: false, message: 'Invalid Indian mobile number. Must start with 6, 7, 8, or 9' };
    }
    
    return { valid: true, formatted };
};

// Assign/Update phone number to business
export const assignPhoneNumber = asyncHandler(async (req, res) => {
    try {
        const { businessId, phoneNumber } = req.body;

        if (!businessId) {
            throw new apiError(400, "Business ID is required");
        }

        // Validate phone number
        const validation = validatePhoneNumber(phoneNumber);
        if (!validation.valid) {
            throw new apiError(400, validation.message);
        }

        const formattedPhone = validation.formatted;

        // Check if phone number is already assigned to another business
        const existingBusiness = await AuthUser.findOne({
            where: {
                assignedPhoneNumber: formattedPhone,
                id: { [Op.ne]: businessId }
            }
        });

        if (existingBusiness) {
            throw new apiError(400, `This phone number is already assigned to "${existingBusiness.businessName || 'another business'}"`);
        }

        // Update the business with assigned phone number
        const business = await AuthUser.findByPk(businessId);
        if (!business) {
            throw new apiError(404, "Business not found");
        }

        business.assignedPhoneNumber = formattedPhone;
        await business.save();

        return res.status(200).json(
            new apiResponse(200, "Phone number assigned successfully", {
                businessId: business.id,
                businessName: business.businessName,
                assignedPhoneNumber: business.assignedPhoneNumber
            })
        );
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        console.error("Error assigning phone number:", error);
        throw new apiError(500, "Error assigning phone number", error.message);
    }
});

// Delete/Remove assigned phone number
export const removePhoneNumber = asyncHandler(async (req, res) => {
    try {
        const { businessId } = req.body;

        if (!businessId) {
            throw new apiError(400, "Business ID is required");
        }

        const business = await AuthUser.findByPk(businessId);
        if (!business) {
            throw new apiError(404, "Business not found");
        }

        business.assignedPhoneNumber = null;
        await business.save();

        return res.status(200).json(
            new apiResponse(200, "Phone number removed successfully", {
                businessId: business.id,
                businessName: business.businessName
            })
        );
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        console.error("Error removing phone number:", error);
        throw new apiError(500, "Error removing phone number", error.message);
    }
});


