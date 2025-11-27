import express from "express";
import { retellWebhook, getCallHistory, getDashboardStats, sendWhatsppTemplate } from "../controllers/retell.webhook.controller.js";

const retellWebhookRoutes = express.Router();

retellWebhookRoutes.post("/retell/webhook", retellWebhook);
retellWebhookRoutes.get("/retell/call-history", getCallHistory);
retellWebhookRoutes.get("/retell/dashboard-stats", getDashboardStats);
retellWebhookRoutes.post("/retell/send-whatsapp-template", sendWhatsppTemplate);

export default retellWebhookRoutes;