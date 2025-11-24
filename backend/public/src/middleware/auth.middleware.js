import jwt from "jsonwebtoken";
import config from "../config/config.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Middleware to verify JWT token and attach user info to request
const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        let token = req.cookies?.accessToken;
        
        if (!token && req.headers.authorization) {
            // Extract token from Bearer token
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json(new apiError(401, "Authentication required. Please login.", [], ""));
        }

        // Verify token
        if (!config.jwtSecret) {
            return res.status(500).json(new apiError(500, "JWT secret is not configured", [], ""));
        }
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Attach user ID to request
        req.userId = decoded._id;
        req.userEmail = decoded.email;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(new apiError(401, "Invalid token. Please login again.", [], ""));
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(new apiError(401, "Token expired. Please login again.", [], ""));
        }
        return res.status(401).json(new apiError(401, "Authentication failed", [], ""));
    }
});

export default authMiddleware;