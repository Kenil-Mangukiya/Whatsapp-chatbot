import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import healthRoutes from "./public/src/routes/health.routes.js";
import webhookRoutes from "./public/src/routes/webhook.routes.js";
import retellWebhookRoutes from "./public/src/routes/retell.route.js";
import locationRoutes from "./public/src/routes/location.route.js";
import { userRoutes } from "./public/src/routes/user.route.js";
import config from "./public/src/config/config.js";
import bolnaRoutes from "./public/src/routes/bolna.route.js";
import apiError from "./public/src/utils/apiError.js";
import plivoRouter from "./public/src/routes/plivo.route.js";

const app = express();

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/', healthRoutes);
app.use('/api', webhookRoutes, retellWebhookRoutes, locationRoutes, bolnaRoutes, plivoRouter);
app.use('/api/user', userRoutes);
// Basic route
app.get('/', (req, res) => {
    res.json({
        message: "WhatsApp Chatbot API",
        version: "1.0.0",
        status: "running",
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
    // If response already sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(err);
    }

    // Handle apiError instances
    if (err instanceof apiError) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Something went wrong",
            errors: err.errors || [],
            statusCode: err.statusCode || 500
        });
    }

    // Handle other errors
    console.error("Unhandled error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        errors: [],
        statusCode: 500
    });
});

export default app;