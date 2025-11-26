import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import axios from "axios";
import config from "../config/config.js";

// ========================
// UPDATED SYSTEM PROMPT
// ========================
const systemPrompt = `
You are the Location Intelligence Engine for an RSA (Roadside Assistance) voice agent.

## YOUR JOB
You receive structured JSON and must ALWAYS return a structured JSON object.

## GLOBAL RULES
1. NEVER speak like a human.
2. NEVER generate sentences, explanations, or extra commentary.
3. ALWAYS return ONLY JSON.
4. No extra text outside JSON.
5. For nearby places, ONLY return clean place names.
6. Remove duplicates, empty names, invalid items, permanently_closed items.
7. Normalize all output for Google Maps search.

## NEW RULES (IMPORTANT)

### A. Zero Results Handling
If Google Geocoding OR Google Places API returns ZERO_RESULTS or empty data:
{
  "no_results_found": true,
  "ask_user_options": false
}

### B. Unique Place Names Are Full Addresses
If user text contains a clear business/place name (e.g., "D Mart Adajan", 
"Wings Hospital", "Star Bazaar", "Reliance Mall", "Decathlon", "VR Mall"):
Return:
{
  "is_full_address": true,
  "clean_query_text": "PLACE_NAME Surat Gujarat India"
}

### C. Full Address Logic
If text is complete:
{
  "is_full_address": true,
  "clean_query_text": "FULL NORMALIZED QUERY Surat Gujarat India"
}

### D. Incomplete Address Logic
If partial:
{
  "is_full_address": false,
  "need_nearby_search": true,
  "search_query": "Adajan Surat Gujarat"
}

### E. Nearby Places API Input
Input:
{
  "type": "google_places_api_response",
  "raw": { ... }
}

Extract:
- ONLY results[i].name
- Remove duplicates
- Remove invalid entries
- Return:

{
  "ask_user_options": true,
  "options": ["Clean Name 1", "Clean Name 2"]
}

### F. User Selected Place
{
  "type": "user_selected_place",
  "selected": "Some Place"
}

Output:
{
  "is_full_address": true,
  "clean_query_text": "Some Place Surat Gujarat India"
}
`;


// ================================
// CALL OPENAI GPT
// ================================
const callChatGPT = async (data) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: JSON.stringify(data) }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    "Authorization": `Bearer ${config.gptKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error calling ChatGPT:", error);
        throw new apiError(500, "Error calling ChatGPT", error.message);
    }
};


// ================================
// UPDATED GEO + NEARBY SEARCH
// ================================
const getLocationFromSearchQuery = async (searchQuery) => {
    try {
        // 1. Updated Geocoding API call
        const geocodeResponse = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address: searchQuery,
                    key: config.googleMapsApiKey,
                    components: "country:IN",
                    language: "en"
                }
            }
        );

        if (
            geocodeResponse.data.status === "ZERO_RESULTS" ||
            geocodeResponse.data.results.length === 0
        ) {
            return { no_results_found: true, ask_user_options: false };
        }

        const { lat, lng } =
            geocodeResponse.data.results[0].geometry.location;

        // 2. Updated Nearby Search API call
        const nearbySearchResponse = await axios.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            {
                params: {
                    location: `${lat},${lng}`,
                    radius: 1500,
                    type: "establishment",
                    language: "en",
                    key: config.googleMapsApiKey
                }
            }
        );

        if (
            nearbySearchResponse.data.status === "ZERO_RESULTS" ||
            !nearbySearchResponse.data.results
        ) {
            return { no_results_found: true, ask_user_options: false };
        }

        return nearbySearchResponse.data;

    } catch (error) {
        console.error("Error in geocoding or nearby search:", error);
        throw new apiError(500, "Error processing location search", error.message);
    }
};


// ================================
// MAIN CONTROLLER
// ================================
export const getLocationDetails = asyncHandler(async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) throw new apiError(400, "Data is required");

        // 1. First GPT call
        const parsedResponse = await callChatGPT(data);

        // If GPT says full address → return directly
        if (parsedResponse.is_full_address === true) {
            return res.status(200).json(
                new apiResponse(200, parsedResponse, "Location processed successfully")
            );
        }

        // If GPT indicates nearby search
        if (
            parsedResponse.is_full_address === false &&
            parsedResponse.search_query
        ) {
            const nearbyPlacesData = await getLocationFromSearchQuery(
                parsedResponse.search_query
            );

            // ZERO RESULTS HANDLING
            if (nearbyPlacesData.no_results_found === true) {
                return res.status(200).json(
                    new apiResponse(200, nearbyPlacesData, "No results")
                );
            }

            // Second GPT call → to extract clean names
            const finalParsedResponse = await callChatGPT({
                type: "google_places_api_response",
                raw: nearbyPlacesData
            });

            return res.status(200).json(
                new apiResponse(200, finalParsedResponse, "Nearby places processed")
            );
        }

        // Default response
        return res.status(200).json(
            new apiResponse(200, parsedResponse, "Location processed successfully")
        );

    } catch (error) {
        console.error("Error handling location intelligence:", error);
        throw new apiError(500, "Location processing error", error.message);
    }
});
