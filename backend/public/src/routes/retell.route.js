import express from "express";
import { retellWebhook, getCallHistory } from "../controllers/retell.webhook.controller.js";

const retellWebhookRoutes = express.Router();

retellWebhookRoutes.post("/retell/webhook", retellWebhook);
retellWebhookRoutes.get("/retell/call-history", getCallHistory);

export default retellWebhookRoutes;