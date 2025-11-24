import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import config from "../config/config.js";

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
        return res.status(400).json(new apiError(400, "Username and email are required", [], ""));
    }

    // Username validation - only letters and underscores
    if (!/^[a-zA-Z_]+$/.test(username)) {
        return res.status(400).json(new apiError(400, "Username must contain only letters and underscores", [], ""));
    }

    // Password validation - must be above 5 characters (only for local registration)
    if (password && password.length <= 5) {
        return res.status(400).json(new apiError(400, "Password must be above 5 characters", [], ""));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(409).json(new apiError(409, "User is already registered", [], ""));
    }

    // Upload avatar if provided
    // upload.any() stores files in req.files array, not req.file
    const avatarFile = req.files && req.files.length > 0 ? req.files[0] : null;
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
    const createdUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            avatar: avatarUrl,
        },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = createdUser;

    return res.status(201).json(new apiResponse(201, "User created successfully", userWithoutPassword));
});

export const logInUser = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    console.table({ email, password, rememberMe });
    
    // Validation
    if (!email || !password) {
        return res.status(400).json(new apiError(400, "Email and password are required", [], ""));
    }

    // Check if user exists - login with email only
    const user = await prisma.user.findUnique({
        where: { email }
    });
    
    if (!user) {
        return res.status(401).json(new apiError(401, "Invalid Credentials", [], ""));
    }
    
    // Check if password exists (for OAuth users without password)
    if (!user.password) {
        return res.status(401).json(new apiError(401, "Please login using Google", [], ""));
    }
    
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json(new apiError(401, "Invalid Credentials", [], ""));
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
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json(new apiResponse(200, "Login successful", {
        user: userWithoutPassword,
        accessToken
    }));
});


