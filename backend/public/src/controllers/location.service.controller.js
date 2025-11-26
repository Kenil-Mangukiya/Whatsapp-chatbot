import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { getLocationDetails } from "../services/location.service.js";

export const getLocation = asyncHandler(async (req, res) => {
    console.log("Location request received : ", req.body);
    
    try 
    {
        const response = await getLocationDetails(req, res);
        console.log("Response is : ", response);
        return res.status(200).json(new apiResponse(200, "Location details fetched successfully", response));
    } 
    catch (error) 
    {
        console.error("Error processing location request:", error);
        throw new apiError(500, "Error processing location", error.message);
    }
});

