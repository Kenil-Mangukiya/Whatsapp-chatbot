import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { getLocationDetails, geocodeLocation } from "../services/location.service.js";
import { getDrivingDistance } from "../utils/googleDistance.js";

export const getLocation = asyncHandler(async (req, res) => {
    console.log("Location request received : ", req.body);
    
    try 
    {
        // Extract user_location from args (Retell function call format) or directly from body
        const user_location = req.body.args?.user_location || req.body.user_location;
        console.log("User location is : ", user_location);

        if (!user_location) {
            throw new apiError(400, "user_location is required");
        }

        // Transform user_location to the expected format
        const locationData = {
            type: "user_location_input",
            text: user_location
        };

        console.log("Location data transformed : ", locationData);

        // Update req.body.data to pass to service
        req.body.data = locationData;

        console.log("Calling getLocationDetails service...");
        
        // Call the location service function which handles req/res
        // Since getLocationDetails sends the response, we just await it
        await getLocationDetails(req, res);
        
        // Response is already sent by getLocationDetails, so we don't need to return anything
        return;
    } 
    catch (error) 
    {
        console.error("Error processing location request:", error);
        // Only throw error if response hasn't been sent yet
        if (!res.headersSent) {
            throw new apiError(500, "Error processing location", error.message);
        }
    }
});

export const getDistance = asyncHandler(async (req, res) => {
    console.log("Distance request received : ", req.body);
    
    try 
    {
        // Extract from_location and to_location from args (Retell function call format) or directly from body
        const from_location = req.body.args?.from_location || req.body.from_location;
        const to_location = req.body.args?.to_location || req.body.to_location;

        console.log("From location:", from_location);
        console.log("To location:", to_location);

        if (!from_location) {
            throw new apiError(400, "from_location is required");
        }

        if (!to_location) {
            throw new apiError(400, "to_location is required");
        }

        // Geocode both locations to get lat/lng and formatted addresses
        console.log("Geocoding from_location...");
        const fromGeocode = await geocodeLocation(from_location);
        console.log("From location geocoded:", fromGeocode);

        console.log("Geocoding to_location...");
        const toGeocode = await geocodeLocation(to_location);
        console.log("To location geocoded:", toGeocode);

        // Use formatted addresses for distance calculation
        const origin = fromGeocode.formatted_address;
        const destination = toGeocode.formatted_address;

        console.log("Calculating driving distance...");
        // Call distance API
        const distanceResult = await getDrivingDistance(origin, destination);
        console.log("Distance calculated:", distanceResult);

        // Return distance in the response
        return res.status(200).json(
            new apiResponse(200, { distance: distanceResult }, "Distance calculated successfully")
        );
    } 
    catch (error) 
    {
        console.error("Error calculating distance:", error);
        throw new apiError(500, "Error calculating distance", error.message);
    }
});

