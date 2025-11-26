import axios from "axios";
import config from "../config/config.js";

export const getDrivingDistance = async (origin, destination) => {
  const resp = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        origins: origin,          // e.g. "Shreeji Arcade Surat Gujarat India"
        destinations: destination, // e.g. "Wings Hospital Surat Gujarat India"
        key: config.googleMapsApiKey,
        units: "metric"           // for km
      }
    }
  );

  if (resp.data.status !== "OK") {
    throw new Error(`DistanceMatrix error: ${resp.data.status}`);
  }

  const element = resp.data.rows?.[0]?.elements?.[0];

  if (!element || element.status !== "OK") {
    throw new Error(`No route found: ${element?.status || "UNKNOWN"}`);
  }

  return {
    distance_meters: element.distance.value,   // e.g. 8423
    distance_text: element.distance.text,      // e.g. "8.4 km"
    duration_seconds: element.duration.value,  // e.g. 1320
    duration_text: element.duration.text       // e.g. "22 mins"
  };
};

