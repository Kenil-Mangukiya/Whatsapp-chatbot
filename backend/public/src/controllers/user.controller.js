import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { AuthUser } from "../db/index.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendWhatsappOTP as sendWhatsappOTPService } from "../services/whatsapp.service.js";
import { storeOTP, verifyOTP } from "../utils/otpStore.js";

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
        console.error("Error extracting OTP from response:", error);
        return null;
    }
};

// Send WhatsApp OTP
export const sendWhatsppOTP = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
        throw new apiError(400, "Phone number is required");
    }
    
    try {
        // Send OTP via WhatsApp service
        const response = await sendWhatsappOTPService(phoneNumber);
        
        // Extract OTP from response
        const otp = extractOTPFromResponse(response);
        
        if (otp) {
            // Log the OTP that was sent
            console.log(`OTP sent to ${phoneNumber}: ${otp}`);
            
            // Store OTP for verification
            storeOTP(phoneNumber, otp);
        } else {
            console.warn(`Could not extract OTP from response for ${phoneNumber}`);
            // Still return success as OTP was sent, just couldn't extract it
        }
        
        return res.status(200).json(
            new apiResponse(200, "OTP sent successfully", {
                phoneNumber: phoneNumber
            })
        );
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw new apiError(500, "Failed to send OTP", error.message);
    }
});

// Login/Register User
export const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    
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
            email: null, // Will be set during setup
            role: 'user', // Default role is 'user'
            assignedPhoneNumber: null // Explicitly set to null - only admin can assign
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
    
    return res.status(200).json(
        new apiResponse(200, "Login successful", {
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                username: user.username
            }
        })
    );
});

// Save Setup Data
export const saveSetupData = asyncHandler(async (req, res) => {
    const user = req.user; // From authenticate middleware
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
    
    // Validate required fields
    if (!businessName || !fullName || !serviceArea) {
        throw new apiError(400, "Business name, full name, and service area are required");
    }
    
    // Validate business hours if provided
    if (startTime && endTime) {
        if (startTime >= endTime) {
            throw new apiError(400, "End time must be greater than start time");
        }
    }
    
    // Update user with setup data
    await user.update({
        businessName,
        fullName,
        email: email || null,
        businessSize: businessSize || null,
        serviceArea,
        startTime: startTime || null,
        endTime: endTime || null,
        vehicleTypes: vehicleTypes && vehicleTypes.length > 0 ? vehicleTypes : null
    });
    
    return res.status(200).json(
        new apiResponse(200, "Setup data saved successfully", {
            user: {
                id: user.id,
                businessName: user.businessName,
                fullName: user.fullName,
                serviceArea: user.serviceArea
            }
        })
    );
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    // Clear the auth token cookie
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    
    return res.status(200).json(
        new apiResponse(200, "Logged out successfully", {})
    );
});

// Get All Businesses (Admin only)
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
                'role',
                'createdAt',
                'updatedAt'
            ],
            order: [['createdAt', 'DESC']]
        });
        
        return res.status(200).json(
            new apiResponse(200, "Businesses fetched successfully", businesses)
        );
    } catch (error) {
        console.error("Error fetching businesses:", error);
        throw new apiError(500, "Error fetching businesses", error.message);
    }
});

// Format phone number utility
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

// Validate phone number
const validatePhoneNumber = (phoneNumber) => {
    const formatted = formatPhoneNumber(phoneNumber);
    if (!formatted) {
        return { valid: false, message: 'Invalid phone number format' };
    }
    
    // Validate Indian mobile number format: +91XXXXXXXXXX
    if (!/^\+91[6-9]\d{9}$/.test(formatted)) {
        return { valid: false, message: 'Invalid Indian mobile number format' };
    }
    
    return { valid: true, formatted };
};

// Assign Phone Number (Admin only)
export const assignPhoneNumber = asyncHandler(async (req, res) => {
    try {
        const { businessId, phoneNumber } = req.body;
        
        if (!businessId) {
            throw new apiError(400, "Business ID is required");
        }
        
        if (!phoneNumber) {
            throw new apiError(400, "Phone number is required");
        }
        
        // Validate and format phone number
        const validation = validatePhoneNumber(phoneNumber);
        if (!validation.valid) {
            throw new apiError(400, validation.message);
        }
        
        const formattedPhone = validation.formatted;
        
        // Check if phone number is already assigned to another business
        const existingBusiness = await AuthUser.findOne({
            where: {
                assignedPhoneNumber: formattedPhone,
                id: { [require('sequelize').Op.ne]: businessId }
            }
        });
        
        if (existingBusiness) {
            throw new apiError(400, `Number is already assigned to ${existingBusiness.businessName || 'another business'}`);
        }
        
        // Find the business
        const business = await AuthUser.findByPk(businessId);
        if (!business) {
            throw new apiError(404, "Business not found");
        }
        
        // Update the business with assigned phone number
        business.assignedPhoneNumber = formattedPhone;
        await business.save();
        
        return res.status(200).json(
            new apiResponse(200, "Phone number assigned successfully", {
                business: {
                    id: business.id,
                    businessName: business.businessName,
                    assignedPhoneNumber: business.assignedPhoneNumber
                }
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

// Change user role (Admin only)
export const changeUserRole = asyncHandler(async (req, res) => {
    const { businessId, newRole } = req.body;
    const currentAdmin = req.user; // The logged-in admin
    
    // Validate input
    if (!businessId) {
        throw new apiError(400, "Business ID is required");
    }
    
    if (!newRole || !['user', 'admin'].includes(newRole)) {
        throw new apiError(400, "Invalid role. Must be 'user' or 'admin'");
    }
    
    // Find the business/user to update
    const business = await AuthUser.findByPk(businessId);
    
    if (!business) {
        throw new apiError(404, "Business not found");
    }
    
    // Prevent admin from changing their own role
    if (business.id === currentAdmin.id) {
        throw new apiError(403, "You cannot change your own role");
    }
    
    // Update the role
    business.role = newRole;
    await business.save();
    
    return res.status(200).json(
        new apiResponse(200, `User role updated to ${newRole}`, {
            business: {
                id: business.id,
                businessName: business.businessName,
                phoneNumber: business.phoneNumber,
                role: business.role
            }
        })
    );
});
