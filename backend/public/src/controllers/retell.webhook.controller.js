import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { storeCallHistoryData } from "../services/retell.service.js";
import { CallHistory, sequelize } from "../db/index.js";
import { Op } from "sequelize";
import { sendWhatsappOTP } from "../services/whatsapp.service.js";

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
                'call_analysis',
                'dynamic_variables',
                'to_number'
            ]
        });

        // Map the data to return only required fields
        const formattedCallHistory = callHistoryRecords.map(record => {
            const callAnalysis = record.call_analysis || {};
            const dynamicVars = record.dynamic_variables || {};
            
            return {
                call_status: record.call_status || null,
                created_at: record.created_at || null,
                duration_ms: record.duration_ms || null,
                transcript: record.transcript || null,
                recording_url: record.recording_url || null,
                disconnection_reason: record.disconnection_reason || null,
                call_summary: callAnalysis.call_summary || null,
                call_sentiment: callAnalysis.user_sentiment || null, // user_sentiment from call_analysis
                call_successful: callAnalysis.call_successful !== undefined ? callAnalysis.call_successful : null,
                dynamic_variables: dynamicVars,
                to_number: record.to_number || null
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


/**
 * Get dashboard statistics
 * Returns total calls, calls today, total duration, and sentiment counts
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        // Get total calls count
        const totalCalls = await CallHistory.count();

        // Get calls today count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const callsToday = await CallHistory.count({
            where: {
                created_at: {
                    [Op.gte]: today
                }
            }
        });

        // Get total duration (sum of all duration_ms)
        const totalDurationResult = await CallHistory.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('duration_ms')), 'total_duration']
            ],
            raw: true
        });
        const totalDurationMs = totalDurationResult[0]?.total_duration || 0;

        // Get sentiment counts
        const allCalls = await CallHistory.findAll({
            attributes: ['call_analysis'],
            where: {
                call_analysis: {
                    [Op.ne]: null
                }
            }
        });

        const sentimentCounts = {
            Positive: 0,
            Negative: 0,
            Unknown: 0,
            Neutral: 0
        };

        allCalls.forEach(call => {
            if (call.call_analysis && typeof call.call_analysis === 'object') {
                const sentiment = call.call_analysis.user_sentiment;
                
                if (sentiment && typeof sentiment === 'string') {
                    const sentimentKey = sentiment.trim();
                    if (sentimentCounts.hasOwnProperty(sentimentKey)) {
                        sentimentCounts[sentimentKey]++;
                    } else {
                        sentimentCounts.Unknown++;
                    }
                } else {
                    sentimentCounts.Unknown++;
                }
            }
        });

        return res.status(200).json(
            new apiResponse(200, "Dashboard stats retrieved successfully", {
                totalCalls,
                callsToday,
                totalDurationMs,
                sentimentCounts
            })
        );
    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        throw new apiError(500, "Error retrieving dashboard stats", error.message);
    }
});

export const sendWhatsppTemplate = asyncHandler(async (req, res) => {
    console.log("Retell webhook received for sendWhatsppTemplate : ", req.body);
    
    try
    {
        // Extract from_number from call object
        const from_number = req.body?.call?.from_number;
        
        console.log("Extracted from_number is : ", from_number);
        
        if (!from_number) {
            throw new apiError(400, "from_number is required in call object");
        }

        // Call sendWhatsappOTP with the extracted phone number
        const response = await sendWhatsappOTP(from_number);
        console.log("WhatsApp OTP response is : ", response);
        
        return res.status(200).json(new apiResponse(200, "Whatsapp OTP sent", response.data));
    }
    catch(error)
    {
        console.error("Error sending WhatsApp OTP:", error);
        return res.status(500).json(new apiError(500, "Something went wrong", error.message));
    }
})