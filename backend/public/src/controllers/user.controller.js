import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import config from "../config/config.js";
import { AuthUser } from "../db/index.js";

// Generate JWT token with user data
const generateToken = (userId, email, avatar, rememberMe = false) => {
    const payload = {
        _id: userId,
        email: email,
        avatar: avatar
    };
    
    // If remember me is checked, token expires in 30 days, otherwise 7 days
    const expiresIn = rememberMe ? "30d" : "7d";
    
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn
    });
};

export const registerUser = asyncHandler(async (req, res) => {
    
    const { username, email, password } = req.body;
    console.table({ username, email, password });
    
    // Validation (password optional for OAuth users)
    if (!username || !email) {
        console.log("Validation failed - missing fields");
        const error = new apiError(400, "Username and email are required", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }

    // Username validation - only letters and underscores
    if (!/^[a-zA-Z_]+$/.test(username)) {
        const error = new apiError(400, "Username must contain only letters and underscores", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }

    // Password validation - must be above 5 characters (only for local registration)
    if (password && password.length <= 5) {
        const error = new apiError(400, "Password must be above 5 characters", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }

    // Check if user already exists
    const existingUser = await AuthUser.findOne({
        where: { email }
    });

    if (existingUser) {
        const error = new apiError(409, "User is already registered. Please use a different email or try logging in.", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }

    // Upload avatar if provided
    // upload.single() stores file in req.file
    const avatarFile = req.file;
    console.log("avatarFile", avatarFile);
    
    const localFilePath = avatarFile?.path;
    let avatarUrl = null;
    if (localFilePath) {
        console.log("Uploading avatar to Cloudinary...");
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        avatarUrl = cloudinaryResponse?.secure_url || null;
        console.log("Avatar URL:", avatarUrl);
    } else {
        console.log("No avatar file provided");
    }

    // Hash password (only for local registration)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create user
    try {
        const createdUser = await AuthUser.create({
            username,
            email,
            password: hashedPassword,
            avatar: avatarUrl,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = createdUser.toJSON();

        return res.status(201).json(
            new apiResponse(201, "User created successfully", userWithoutPassword)
        );
    } catch (dbError) {
        console.error("Database error creating user:", dbError);
        
        // Check if it's a unique constraint error (duplicate email only)
        if (dbError.name === 'SequelizeUniqueConstraintError') {
            const field = dbError.errors?.[0]?.path || 'field';
            // Only check for email duplicates, not username
            if (field === 'email') {
                const error = new apiError(409, "Email already exists. Please use a different email or try logging in.", [], "");
                return res.status(error.statusCode).json({
                    success: error.success,
                    statusCode: error.statusCode,
                    message: error.message,
                    errors: error.errors
                });
            }
            // If it's a username constraint error, it shouldn't happen, but handle it gracefully
            const error = new apiError(409, "Registration failed. Please try again.", [], "");
            return res.status(error.statusCode).json({
                success: error.success,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors
            });
        }
        
        // Check if table doesn't exist
        if (dbError.message && dbError.message.includes("doesn't exist")) {
            const error = new apiError(500, "Database table not found. Please run migrations: npx sequelize-cli db:migrate", [], "");
            return res.status(error.statusCode).json({
                success: error.success,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors
            });
        }
        
        // Generic database error
        const error = new apiError(500, "Failed to create user. Please try again later.", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }
});

export const logInUser = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    console.table({ email, password, rememberMe });
    
    // Validation
    if (!email || !password) {
        const error = new apiError(400, "Email and password are required", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }

    // Check if user exists - login with email only
    const user = await AuthUser.findOne({
        where: { email }
    });
    
    if (!user) {
        const error = new apiError(401, "Invalid Credentials", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }
    
    // Check if password exists (for OAuth users without password)
    if (!user.password) {
        const error = new apiError(401, "Please login using Google", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }
    
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        const error = new apiError(401, "Invalid Credentials", [], "");
        return res.status(error.statusCode).json({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors
        });
    }
    
    // Generate token with user data and rememberMe preference
    const accessToken = generateToken(user.id, user.email, user.avatar, rememberMe);
    
    // Calculate cookie maxAge based on rememberMe
    const cookieMaxAge = rememberMe 
        ? 30 * 24 * 60 * 60 * 1000  // 30 days
        : 7 * 24 * 60 * 60 * 1000;  // 7 days
    
    // Store token in HTTP-only cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: cookieMaxAge
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return res.status(200).json(
        new apiResponse(200, "Login successful", {
            user: userWithoutPassword,
            accessToken
        })
    );
});


