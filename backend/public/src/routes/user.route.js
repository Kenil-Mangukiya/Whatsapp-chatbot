import express from "express";
import { sendWhatsppOTP, loginUser, saveSetupData } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

const userRoutes = express.Router();

userRoutes.post("/send-otp", sendWhatsppOTP);
userRoutes.post("/login", loginUser);

// Protected route to check authentication status
userRoutes.get("/me", authenticate, asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Check if setup is complete (has required fields: businessName, fullName, serviceArea)
    const setupCompleted = !!(user.businessName && user.fullName && user.serviceArea);
    
    return res.status(200).json(
        new apiResponse(200, "User authenticated", {
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                username: user.username,
                businessName: user.businessName,
                fullName: user.fullName,
                email: user.email,
                businessSize: user.businessSize,
                serviceArea: user.serviceArea,
                startTime: user.startTime,
                endTime: user.endTime,
                vehicleTypes: user.vehicleTypes
            },
            setupCompleted: setupCompleted
        })
    );
}));

// Protected route to save setup data
userRoutes.post("/setup", authenticate, saveSetupData);

export { userRoutes };