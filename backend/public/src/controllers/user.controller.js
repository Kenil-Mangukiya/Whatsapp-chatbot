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

// Generate JWT token with user data
const generateToken = (userId, phoneNumber, rememberMe = false) => {
    const payload = {
        _id: userId,
        phoneNumber: phoneNumber
    };
    
    // If remember me is checked, token expires in 30 days, otherwise 7 days
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
        console.log("WhatsApp response is : ", response);
        
        // Extract OTP from response
        const extractedOtp = extractOTPFromResponse(response);
        
        if (extractedOtp) {
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
            console.error("Could not extract OTP from response:", response);
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
    
    if (vehicleTypes && Array.isArray(vehicleTypes)) {
        updateData.vehicleTypes = vehicleTypes;
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


