import express from "express";
import { getLocation, getDistance } from "../controllers/location.service.controller.js";

const locationRoutes = express.Router();

locationRoutes.post("/location/get-details", getLocation);
locationRoutes.post("/location/get-distance", getDistance);

export default locationRoutes;

