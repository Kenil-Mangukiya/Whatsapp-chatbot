import { whatsappWebhook } from "../controllers/whatsapp.webhook.controller.js";
import express from "express";

const webhookRoutes = express.Router();

webhookRoutes.post("/whatsapp/webhook", whatsappWebhook);

export default webhookRoutes;