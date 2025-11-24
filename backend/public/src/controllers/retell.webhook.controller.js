import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { storeCallHistoryData } from "../services/retell.service.js";
import { CallHistory } from "../db/index.js";

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
});

/**
 * Get call history with only required fields for frontend
 * Returns: call_status, created_at, duration_ms, transcript, recording_url, 
 * disconnection_reason, call_summary, user_sentiment, call_successful
 */
export const getCallHistory = asyncHandler(async (req, res) => {
    try {
        // Fetch all call history records
        const callHistoryRecords = await CallHistory.findAll({
            order: [['created_at', 'DESC']], // Most recent first
            attributes: [
                'call_status',
                'created_at',
                'duration_ms',
                'transcript',
                'recording_url',
                'disconnection_reason',
                'call_analysis'
            ]
        });

        // Map the data to return only required fields
        const formattedCallHistory = callHistoryRecords.map(record => {
            const callAnalysis = record.call_analysis || {};
            
            return {
                call_status: record.call_status || null,
                created_at: record.created_at || null,
                duration_ms: record.duration_ms || null,
                transcript: record.transcript || null,
                recording_url: record.recording_url || null,
                disconnection_reason: record.disconnection_reason || null,
                call_summary: callAnalysis.call_summary || null,
                call_sentiment: callAnalysis.user_sentiment || null, // user_sentiment from call_analysis
                call_successful: callAnalysis.call_successful !== undefined ? callAnalysis.call_successful : null
            };
        });

        return res.status(200).json(
            new apiResponse(200, "Call history retrieved successfully", formattedCallHistory)
        );
    } catch (error) {
        console.error("Error fetching call history:", error);
        throw new apiError(500, "Error fetching call history", error.message);
    }
});