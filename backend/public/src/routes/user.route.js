import express from "express";
import { sendWhatsppOTP, loginUser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

const userRoutes = express.Router();

userRoutes.post("/send-otp", sendWhatsppOTP);
userRoutes.post("/login", loginUser);

// Protected route to check authentication status
userRoutes.get("/me", authenticate, asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(200, "User authenticated", {
            user: {
                id: req.user.id,
                phoneNumber: req.user.phoneNumber,
                username: req.user.username
            }
        })
    );
}));

export { userRoutes };