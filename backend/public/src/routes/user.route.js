import express from "express";
import { registerUser, logInUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", upload.single("avatar"), registerUser);
userRoutes.post("/login", logInUser);

export { userRoutes };