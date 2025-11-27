import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

export const bolnaWebhook = asyncHandler(async (req, res) => {
    console.log("req.body is : ", req.body);
})