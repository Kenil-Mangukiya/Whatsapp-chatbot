import express from "express";
import { sendWhatsppOTP } from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.post("/send-otp", sendWhatsppOTP);

export { userRoutes };