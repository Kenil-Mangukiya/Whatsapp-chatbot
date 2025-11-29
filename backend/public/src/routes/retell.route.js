import express from "express";
import { retellWebhook, getCallHistory, getDashboardStats, getCallsPerDay, sendWhatsppTemplate } from "../controllers/retell.webhook.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const retellWebhookRoutes = express.Router();

// Public webhook endpoint (no authentication needed)
retellWebhookRoutes.post("/retell/webhook", retellWebhook);

// Protected endpoints (require authentication)
retellWebhookRoutes.get("/retell/call-history", authenticate, getCallHistory);
retellWebhookRoutes.get("/retell/dashboard-stats", authenticate, getDashboardStats);
retellWebhookRoutes.get("/retell/calls-per-day", authenticate, getCallsPerDay);
retellWebhookRoutes.post("/retell/send-whatsapp-template", sendWhatsppTemplate);

export default retellWebhookRoutes;