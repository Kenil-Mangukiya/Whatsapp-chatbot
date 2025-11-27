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
app.use('/api', webhookRoutes, retellWebhookRoutes, locationRoutes, bolnaRoutes);
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

export default app;