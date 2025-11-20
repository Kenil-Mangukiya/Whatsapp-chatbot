import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

export const retellWebhook = asyncHandler(async (req, res) => {
    console.log("retell webhook received : ", req.body);
})