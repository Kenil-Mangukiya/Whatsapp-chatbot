import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

export const webhook = asyncHandler(async (req, res) => {
    console.log("webhook received : ", req.body);
    return res.status(200).json(new apiResponse(200, "Webhook received", {}));
})

export default webhook;