import express from "express";
import { sendWhatsppOTP, loginUser, saveSetupData, logoutUser, getAllBusinesses, assignPhoneNumber, removePhoneNumber, changeUserRole, saveAgentSetup, adminLoginAsUser } from "../controllers/user.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
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
                vehicleTypes: user.vehicleTypes,
                role: user.role || 'user' // Include role in response
            },
            setupCompleted: setupCompleted
        })
    );
}));

// Protected route to save setup data
userRoutes.post("/setup", authenticate, saveSetupData);

// Protected route to save agent setup data
userRoutes.post("/agent-setup", authenticate, saveAgentSetup);

// Logout route
userRoutes.post("/logout", logoutUser);

// Admin routes - require both authentication and admin role
userRoutes.get("/businesses", authenticate, isAdmin, getAllBusinesses);
userRoutes.post("/assign-phone", authenticate, isAdmin, assignPhoneNumber);
userRoutes.post("/remove-phone", authenticate, isAdmin, removePhoneNumber);
userRoutes.post("/change-role", authenticate, isAdmin, changeUserRole);
userRoutes.post("/admin/login-as-user", authenticate, isAdmin, adminLoginAsUser);

export { userRoutes };