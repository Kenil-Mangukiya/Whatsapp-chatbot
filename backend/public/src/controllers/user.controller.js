import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import config from "../config/config.js";
import { AuthUser } from "../db/index.js";
import { sendWhatsappOTP } from "../services/whatsapp.service.js";

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

export const sendWhatsppOTP = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    console.log("phone number is : ", phoneNumber);
    try
    {
        const response = await sendWhatsappOTP(phoneNumber);
        console.log("response is : ", response);
        return res.status(200).json(new apiResponse(200, "Whatsapp OTP sent", response.data));
    }
    catch(error)
    {
        console.log("error is : ", error);
        return res.status(500).json(new apiError(500, "Something went wrong", error.message));
    }
})


