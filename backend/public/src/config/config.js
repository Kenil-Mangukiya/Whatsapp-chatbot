import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config = {
    port: process.env.BACKEND_PORT,
    corsOrigin: process.env.CORS_ORIGIN,
    cloudinaryCloudName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    jwtSecret: process.env.JWT_SECRET,
    upmatrixUri: process.env.UPMATRIX_URI,
    upmatrixToken: process.env.UPMATRIX_TOKEN,
    gptKey: process.env.GPT_KEY,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
}

export default config;