import express from "express";
import { retellWebhook, getCallHistory, getDashboardStats } from "../controllers/retell.webhook.controller.js";

const retellWebhookRoutes = express.Router();

retellWebhookRoutes.post("/retell/webhook", retellWebhook);
retellWebhookRoutes.get("/retell/call-history", getCallHistory);
retellWebhookRoutes.get("/retell/dashboard-stats", getDashboardStats);

export default retellWebhookRoutes;