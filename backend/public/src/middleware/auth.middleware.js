import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { AuthUser } from "../db/index.js";
import apiError from "../utils/apiError.js";

// Authentication middleware to protect routes
export const authenticate = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies?.authToken;
        
        if (!token) {
            throw new apiError(401, "Authentication required. Please login.");
        }
        
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Find user by ID from token
        const user = await AuthUser.findByPk(decoded._id);
        
        if (!user) {
            throw new apiError(401, "User not found. Please login again.");
        }
        
        // Attach user to request object
        req.user = user;
        req.userId = user.id;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new apiError(401, "Invalid token. Please login again.");
        } else if (error.name === 'TokenExpiredError') {
            throw new apiError(401, "Token expired. Please login again.");
        } else {
            throw error;
        }
    }
};
