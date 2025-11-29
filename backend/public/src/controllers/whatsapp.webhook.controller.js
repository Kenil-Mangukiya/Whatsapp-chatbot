import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
// import { sendWelcomeMessageTemplate } from "../services/whatsapp.service.js";

export const whatsappWebhook = asyncHandler(async (req, res) => {
    console.log("webhook received : ", req.body);
    // if(!req.body)
    // {
    //     return 
    // }
    // const contactNumber = req.body.args.contact_number;
    // if(!contactNumber)
    // {
    //     return res.status(400).json(new apiError(400, "Contact number is required", []));
    // }
    // try
    // {
    //     const response = await sendWelcomeMessageTemplate(contactNumber);
    //     console.log("Response is : ", response);
    //     return res.status(200).json(new apiResponse(200, "Welcome message template sent", response));
    // }
    // catch(error)
    // {
    //     console.log("Error while sending welcome message template : ", error);
    //     return res.status(500).json(new apiError(500, "Something went wrong", error.message));
    // }
})
