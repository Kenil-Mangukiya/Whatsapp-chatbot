import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { storeCallHistoryData } from "../services/retell.service.js";

export const retellWebhook = asyncHandler(async (req, res) => {
    console.log("retell webhook received : ", req.body);
    
    try {
        const webhookData = req.body;
        
        // Only process call_analyzed events
        if (webhookData.event === "call_analyzed" && webhookData.call) {
            // Store call history data
            await storeCallHistoryData(webhookData);
            
            return res.status(200).json(
                new apiResponse(200, {}, "Call history stored successfully")
            );
        }
        
        // For other events, just acknowledge
        return res.status(200).json(
            new apiResponse(200, {}, "Webhook received")
        );
    } catch (error) {
        console.error("Error processing retell webhook:", error);
        throw new apiError(500, "Error processing webhook", error.message);
    }
})