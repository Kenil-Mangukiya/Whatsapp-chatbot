import express from "express";
import { getLocation } from "../controllers/location.service.controller.js";

const locationRoutes = express.Router();

locationRoutes.post("/location/get-details", getLocation);

export default locationRoutes;

