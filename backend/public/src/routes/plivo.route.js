import { sendPlivoMessage, sendPlivoMessageToAgent } from "../controllers/plivo.controller.js";
import express from "express"

const plivoRouter = express.Router()

plivoRouter.post("/plivo/send-message", sendPlivoMessage);
plivoRouter.post("/plivo/send-message-to-agent", sendPlivoMessageToAgent);

export default plivoRouter;