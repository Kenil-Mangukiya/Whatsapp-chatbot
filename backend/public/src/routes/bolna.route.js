import express from "express";
import { bolnaWebhook } from "../controllers/bolna.controller.js";

const bolnaRoutes = express.Router();

bolnaRoutes.post("/bolna/webhook", bolnaWebhook);

export default bolnaRoutes;