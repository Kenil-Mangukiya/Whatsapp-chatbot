import webhook from "../controllers/webhook.controller.js";
import express from "express";

const webhookRoutes = express.Router();

webhookRoutes.post("/webhook", webhook);

export default webhookRoutes;