import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";

const config = (method, url, data) => {
    // Validate required parameters
    if (!method) {
        throw new Error("method is required");
    }
    if (!url) {
        throw new Error("url is required");
    }
    if (!data) {
        throw new Error("data is required");
    }

    // Construct full URL from environment variable and provided path
    const baseUrl = process.env.UPMATRIX_URI;
    const fullUrl = `${baseUrl}${url}`;

    // Build config object
    const configObject = {
        method: method.toLowerCase(),
        maxBodyLength: Infinity,
        url: fullUrl,
        headers: {
            'accept': 'application/json',
            'authorization': `${process.env.UPMATRIX_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return configObject;
}

const data = (contactNumber, templateName, options = {}) => {
    // Validate required parameters
    if (!contactNumber) {
        throw new Error("contact_number is required");
    }
    if (!templateName) {
        throw new Error("template_name is required");
    }

    // Build the data object
    const dataObject = {
        contact_number: contactNumber,
        template_name: templateName
    };

    // Add optional header_vars if provided
    if (options.header_vars && Array.isArray(options.header_vars)) {
        dataObject.header_vars = options.header_vars;
    }

    // Add optional body_vars if provided
    if (options.body_vars && Array.isArray(options.body_vars)) {
        dataObject.body_vars = options.body_vars;
    }

    // Add optional metadata if provided
    if (options.metadata) {
        dataObject.metadata = {};
        
        if (options.metadata.thumbnail) {
            dataObject.metadata.thumbnail = options.metadata.thumbnail;
        }

        if (options.metadata.sections && Array.isArray(options.metadata.sections)) {
            dataObject.metadata.sections = options.metadata.sections;
        }
    }

    return JSON.stringify(dataObject);
}

const sendWelcomeMessageTemplate = async (phoneNumber) => {
    console.log("Phone number is : ", phoneNumber);
    if(!phoneNumber) 
    {
        throw new apiError(400, "Phone number is required", []);
    }

    try
    {
        const callData = await data(phoneNumber, "welcome_template")
        console.log("Call data is : ", callData);
        const callConfig = await config("POST", "/send-template-message", callData)
        console.log("Call config is : ", callConfig);
        const response = await axios(callConfig)
        console.log("Response is : ", response);
        return response;
    }
    catch(error)
    {
        console.log("Error while sending welcome message template : ", error);
        throw new apiError(500, "Something went wrong", error.message);
    }
}

const sendWhatsappOTP = async (phoneNumber) => {
    console.log("Phone number is : ", phoneNumber);
    if(!phoneNumber)
    {
        throw new apiError(400, "Phone number is required", []);
    }
    try
    {
        const callData = await data(phoneNumber, "otp_template")
        console.log("Call data is : ", callData);
        const callConfig = await config("POST", "/send-template-message", callData)
        console.log("Call config is : ", callConfig);
        const response = await axios(callConfig)
        console.log("Response is : ", response);
        return response;
    }
    catch(error)
    {
        console.log("Error while sending whatsapp OTP : ", error);
        throw new apiError(500, "Something went wrong", error.message);
    }
}

export { sendWelcomeMessageTemplate, sendWhatsappOTP };