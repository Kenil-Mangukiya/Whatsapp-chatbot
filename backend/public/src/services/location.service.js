import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import axios from "axios";
import config from "../config/config.js";


// =====================================================
// UPDATED SYSTEM PROMPT (supports nearby + textsearch)
// =====================================================
const systemPrompt = `
You are the Location Intelligence Engine for an RSA (Roadside Assistance) voice agent.

## CORE RULES
1. ALWAYS return ONLY JSON.
2. NEVER speak like a human.
3. No explanations, no commentary, no sentences.
4. ALWAYS clean and normalize place names.
5. Remove duplicates, invalid names, personal names, services, coaching classes, doctors, clinics, tutors, and irrelevant POIs.
6. DO NOT return small training centers, education classes, or random business names.
7. 7. ALWAYS return exactly 4 of the MOST POPULAR and WELL-KNOWN places. Never return 3. Never return 5. Always return exactly 4 landmarks..
8. SELECT PLACES ONLY FROM THE PROVIDED GOOGLE DATA.
9. **NEVER return the user-provided location back as a landmark.**  
   Example: if user says “Adajan,” do NOT return “Adajan,” “Surat,” “Gujarat,” etc.

---

# PRIORITY ORDER FOR LANDMARK SELECTION

### PRIORITY 1 — Junctions / Circles / Chowks
Examples:
- Vesu Char Rasta
- LP Savani Circle
- Honey Park Chowk
- Citylight Junction
- Gas Circle

### PRIORITY 2 — Malls / Big Stores / Supermarkets
Examples:
- VR Mall
- D-Mart
- Star Bazaar
- Reliance Mall

### PRIORITY 3 — Colleges / Schools (Large & known only)
Examples:
- LP Savani School
- DPS
- Fountainhead School
- SVNIT
- GD Goenka School

### PRIORITY 4 — Major Hospitals (big only)
Examples:
- Unique Hospital
- Apple Hospital
- Sunshine Global Hospital

### PRIORITY 5 — Big Societies / Banks / Main Roads
Examples:
- Green City Road
- Amby Valley Society
- Citylight Area
- Vesu Road

Reject:
– Coaching classes  
– Small institutes  
– Doctors  
– Consultants  
– Local shops  
– Non-landmark offices  
– Person names  
– **The user's own location text**

---

# SELECTION RULE
Pick ONLY ONE category (highest priority with at least 3–4 valid places).
Return:
{
  "ask_user_options": true,
  "landmarks": ["Place 1", "Place 2", "Place 3"]
}

---

# NAME CLEANING RULES
Keep ONLY the main place name.
Remove:
- marketing words
- filler words
- special characters
- pipes "|"
- trailing suffixes

---

# ZERO RESULTS
If nearby + textsearch both fail:
{
  "no_results_found": true,
  "ask_user_options": false
}

---

# INPUT TYPES

### USER LOCATION INPUT
Input:
{
  "type": "user_location_input",
  "text": "vesu"
}

If full:
{
  "is_full_address": true,
  "clean_query_text": "Vesu Surat Gujarat India"
}

If partial:
{
  "is_full_address": false,
  "need_nearby_search": true,
  "search_query": "Vesu Surat Gujarat"
}

---

### GOOGLE PLACES API RESPONSE
Input:
{
  "type": "google_places_api_response",
  "raw": {
     nearby: {...},
     textsearch: {...}
  }
}

Output:
{
  "ask_user_options": true,
  "landmarks": ["Top Place 1", "Top Place 2", "Top Place 3", "Top Place 4"]
}

---

### USER SELECTED PLACE
Input:
{
  "type": "user_selected_place",
  "selected": "VR Mall"
}

Output:
{
  "is_full_address": true,
  "clean_query_text": "VR Mall Surat Gujarat India"
}
`;



// =====================================================
// OPENAI CALL
// =====================================================
const callChatGPT = async (data) => {
    try {
        console.log("callChatGPT called with data:", data);

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: JSON.stringify(data) }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    Authorization: `Bearer ${config.gptKey}`,
                    "Content-Type": "application/json",
                }
            }
        );

        const parsed = JSON.parse(response.data.choices[0].message.content);
        console.log("GPT Parsed Response:", parsed);
        return parsed;

    } catch (err) {
        console.error("ChatGPT error:", err.response?.data || err);
        throw new apiError(500, "Error calling ChatGPT");
    }
};



// =====================================================
// GEOCODE LOCATION TEXT TO LAT/LNG
// =====================================================
export const geocodeLocation = async (locationText) => {
    try {
        const geo = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address: locationText,
                    key: config.googleMapsApiKey,
                    components: "country:IN",
                    language: "en"
                }
            }
        );

        if (geo.data.status === "ZERO_RESULTS" || geo.data.results.length === 0) {
            throw new apiError(400, "Location not found", `Could not geocode: ${locationText}`);
        }

        const { lat, lng } = geo.data.results[0].geometry.location;
        const formattedAddress = geo.data.results[0].formatted_address;

        return {
            lat,
            lng,
            formatted_address: formattedAddress,
            location_text: locationText
        };
    } catch (error) {
        console.error("Error geocoding location:", error);
        throw new apiError(500, "Error geocoding location", error.message);
    }
};

// =====================================================
// GEO + NEARBY SEARCH + TEXT SEARCH (POPULARITY)
// =====================================================
const getLocationFromSearchQuery = async (searchQuery) => {
    try {
        // -------------------------------
        // 1. GEOCODING → LAT/LNG
        // -------------------------------
        const geo = await axios.get(
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

        if (geo.data.status === "ZERO_RESULTS" || geo.data.results.length === 0) {
            return { no_results_found: true, ask_user_options: false };
        }

        const { lat, lng } = geo.data.results[0].geometry.location;


        // -------------------------------
        // 2. NEARBY SEARCH (Proximity)
        // -------------------------------
        const nearby = await axios.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            {
                params: {
                    location: `${lat},${lng}`,
                    radius: 2000,
                    type: "establishment",
                    language: "en",
                    key: config.googleMapsApiKey
                }
            }
        );


        // -------------------------------
        // 3. TEXT SEARCH (Popularity)
        // -------------------------------
        const textsearch = await axios.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            {
                params: {
                    query: `popular landmarks near ${searchQuery}`,
                    location: `${lat},${lng}`,
                    radius: 4000,
                    key: config.googleMapsApiKey
                }
            }
        );

        return {
            nearby: nearby.data,
            textsearch: textsearch.data
        };

    } catch (error) {
        console.error("Error in geocoding or searching:", error);
        throw new apiError(500, "Error searching places");
    }
};



// =====================================================
// MAIN HANDLER
// =====================================================
export const getLocationDetails = asyncHandler(async (req, res) => {
    const { data } = req.body;

    if (!data) throw new apiError(400, "Data is required");

    // 1. First GPT call (address understanding)
    const parsed = await callChatGPT(data);

    if (parsed.is_full_address === true) {
        return res.status(200).json(new apiResponse(200, parsed, "OK"));
    }

    // 2. If incomplete → fetch Google data
    if (parsed.is_full_address === false && parsed.search_query) {
        const googleResults = await getLocationFromSearchQuery(parsed.search_query);

        if (googleResults.no_results_found === true) {
            return res.status(200).json(new apiResponse(200, googleResults, "NO RESULTS"));
        }

        // 3. Second GPT call (select top landmarks)
        const finalResp = await callChatGPT({
            type: "google_places_api_response",
            raw: googleResults
        });

        // Ensure landmarks variable is present (transform options to landmarks if needed)
        if (finalResp.options && !finalResp.landmarks) {
            finalResp.landmarks = finalResp.options;
            delete finalResp.options;
        }

        // Ensure landmarks is always an array
        if (!finalResp.landmarks && finalResp.ask_user_options) {
            finalResp.landmarks = [];
        }

        return res.status(200).json(new apiResponse(200, finalResp, "LANDMARK OPTIONS"));
    }

    return res.status(200).json(new apiResponse(200, parsed, "OK"));
});
``