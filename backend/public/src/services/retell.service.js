import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { CallHistory } from "../db/index.js";
import { Op } from "sequelize";

/**
 * Process and filter call history data from Retell webhook
 * Maps webhook data to database fields with appropriate fallbacks
 */
export const filterCallHistoryData = (webhookData) => {
    console.log("Call data is : ", webhookData);
    try {
        // Extract call object from webhook
        const call = webhookData?.call || {};
        
        // Helper function to get value with fallback
        const getValue = (value, fallback) => {
            if (value === null || value === undefined) {
                return fallback;
            }
            if (typeof value === 'string' && value.trim() === '') {
                return fallback;
            }
            return value;
        };

        // Process dynamic_variables - exclude previous_node and current_node
        let dynamicVariables = null;
        if (call.collected_dynamic_variables && typeof call.collected_dynamic_variables === 'object' && !Array.isArray(call.collected_dynamic_variables)) {
            const { previous_node, current_node, ...rest } = call.collected_dynamic_variables;
            // Only store if there are remaining fields after excluding previous_node and current_node
            if (Object.keys(rest).length > 0) {
                dynamicVariables = rest;
            }
        }

        // Calculate cost - use combined_cost if available, otherwise calculate from unit price and duration
        let cost = null;
        if (call.call_cost) {
            if (call.call_cost.combined_cost !== undefined && call.call_cost.combined_cost !== null) {
                cost = parseFloat(call.call_cost.combined_cost);
            } else if (call.call_cost.total_duration_unit_price && call.call_cost.total_duration_seconds) {
                cost = parseFloat(call.call_cost.total_duration_unit_price) * parseFloat(call.call_cost.total_duration_seconds);
            }
        }

        // Process call_analysis - store the whole object
        let callAnalysis = null;
        if (call.call_analysis && typeof call.call_analysis === 'object' && !Array.isArray(call.call_analysis)) {
            callAnalysis = call.call_analysis;
        }

        // Map webhook data to database fields
        const processedData = {
            call_id: getValue(call.call_id, ""),
            agent_id: getValue(call.agent_id, ""),
            agent_name: getValue(call.agent_name, ""),
            call_type: getValue(call.call_type, ""),
            call_status: getValue(call.call_status, ""),
            duration_ms: call.duration_ms !== null && call.duration_ms !== undefined ? parseInt(call.duration_ms) : null,
            start_timestamp: call.start_timestamp !== null && call.start_timestamp !== undefined ? Number(call.start_timestamp) : null,
            end_timestamp: call.end_timestamp !== null && call.end_timestamp !== undefined ? Number(call.end_timestamp) : null,
            dynamic_variables: dynamicVariables,
            transcript: getValue(call.transcript, ""),
            cost: cost,
            recording_url: getValue(call.recording_url, ""),
            log_url: getValue(call.public_log_url, ""),
            disconnection_reason: getValue(call.disconnection_reason, ""),
            call_analysis: callAnalysis,
            created_at: new Date()
        };

        return processedData;
    }
    catch(error) {
        console.error("Error filtering call history data:", error);
        throw new apiError(500, "Error processing call history data", error.message);
    }
};

/**
 * Store call history data in database
 */
export const storeCallHistoryData = asyncHandler(async (callData) => {
    console.log("Storing call history data:", callData);
    try {
        // First filter/process the data
        const processedData = filterCallHistoryData(callData);
        
        // Validate that processedData exists and has call_id
        if (!processedData || !processedData.call_id) {
            throw new apiError(400, "Invalid call data: call_id is required");
        }
        
        // Check if call already exists
        const existingCall = await CallHistory.findOne({
            where: { call_id: processedData.call_id }
        });

        if (existingCall) {
            // Update existing record
            await CallHistory.update(processedData, {
                where: { call_id: processedData.call_id }
            });
            console.log(`Call history updated for call_id: ${processedData.call_id}`);
            return existingCall;
        } else {
            // Create new record
            const newCallHistory = await CallHistory.create(processedData);
            console.log(`Call history created for call_id: ${processedData.call_id}`);
            return newCallHistory;
        }
    }
    catch(error) {
        console.log("Error while storing call history : ", error);
        throw new apiError(500, "Something went wrong", error.message);
    }
});

/**
 * Get sentiment counts from call history
 * Returns the number of each sentiment type (Positive, Negative, Unknown, Neutral)
 * @returns {Promise<Object>} Object with sentiment counts
 */
export const getSentimentCounts = asyncHandler(async () => {
    try {
        // Fetch all call history records with call_analysis
        const allCalls = await CallHistory.findAll({
            attributes: ['call_analysis'],
            where: {
                call_analysis: {
                    [Op.ne]: null
                }
            }
        });

        // Initialize sentiment counts
        const sentimentCounts = {
            Positive: 0,
            Negative: 0,
            Unknown: 0,
            Neutral: 0
        };

        // Process each call record
        allCalls.forEach(call => {
            if (call.call_analysis && typeof call.call_analysis === 'object') {
                const sentiment = call.call_analysis.user_sentiment;
                
                // Check if sentiment exists and is a valid type
                if (sentiment && typeof sentiment === 'string') {
                    const sentimentKey = sentiment.trim();
                    
                    // Increment count if sentiment matches one of the valid types
                    if (sentimentCounts.hasOwnProperty(sentimentKey)) {
                        sentimentCounts[sentimentKey]++;
                    } else {
                        // If sentiment is not one of the expected types, count it as Unknown
                        sentimentCounts.Unknown++;
                    }
                } else {
                    // If user_sentiment is missing or invalid, count as Unknown
                    sentimentCounts.Unknown++;
                }
            }
        });

        return sentimentCounts;
    }
    catch(error) {
        console.error("Error getting sentiment counts:", error);
        throw new apiError(500, "Error retrieving sentiment counts", error.message);
    }
});

