import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { sendRSADetailsTemplate } from "../services/whatsapp.service.js";

export const sendPlivoMessage = asyncHandler(async (req, res) => {
    console.log("Plivo message request received : ", req.body);
    
    // Extract the from_number (caller's phone number) from the request body
    const { from_number } = req.body;
    
    // Validate that from_number is provided
    if (!from_number) {
        throw new apiError(400, "from_number is required in the request body", []);
    }
    
    console.log("Extracted from_number: ", from_number);
    
    try {
        // Send the rsa_details template to the caller's WhatsApp number
        const whatsappResponse = await sendRSADetailsTemplate(from_number);
        console.log("WhatsApp RSA details template sent successfully: ", whatsappResponse.data);
        
        // Return success response
        return res.status(200).json(new apiResponse(
            true, 
            "Plivo message processed and RSA details template sent to WhatsApp", 
            {
                from_number: from_number,
                whatsapp_response: whatsappResponse.data
            }
        ));
    } catch (error) {
        console.error("Error sending RSA details template: ", error);
        throw new apiError(
            500, 
            "Failed to send RSA details template to WhatsApp", 
            [error.message]
        );
    }
});

export const sendPlivoMessageToAgent = asyncHandler(async (req, res) => {
    console.log("Plivo message to agent request received : ", req.body);
    
    // Extract the to_number (Plivo number/agent's number) from the request body
    const { to_number } = req.body;
    
    // Validate that to_number is provided
    if (!to_number) {
        throw new apiError(400, "to_number is required in the request body", []);
    }
    
    console.log("Extracted to_number: ", to_number);
    
    try {
        // Send the rsa_details template to the agent's WhatsApp number
        const whatsappResponse = await sendRSADetailsTemplate(to_number);
        console.log("WhatsApp RSA details template sent successfully to agent: ", whatsappResponse.data);
        
        // Return success response
        return res.status(200).json(new apiResponse(
            true, 
            "RSA details template sent to agent WhatsApp successfully", 
            {
                to_number: to_number,
                whatsapp_response: whatsappResponse.data
            }
        ));
    } catch (error) {
        console.error("Error sending RSA details template to agent: ", error);
        throw new apiError(
            500, 
            "Failed to send RSA details template to agent WhatsApp", 
            [error.message]
        );
    }
});