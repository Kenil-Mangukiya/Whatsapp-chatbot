import express from "express";
import { retellWebhook } from "../controllers/retell.webhook.controller.js";

const retellWebhookRoutes = express.Router();

retellWebhookRoutes.post("/retell/webhook", retellWebhook);

export default retellWebhookRoutes;