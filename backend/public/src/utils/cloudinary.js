import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config/config.js";

cloudinary.config({ 
    cloud_name: config.cloudinaryCloudName, 
    api_key: config.cloudinaryApiKey, 
    api_secret: config.cloudinaryApiSecret
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            return null;
        }
        
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        });
        
        console.log("Success: File uploaded to cloudinary at:", response.url);
        
        // Delete local file after successful upload
        fs.unlinkSync(filePath);
        
        return response;
    } catch (error) {
        console.log("Error: While uploading file to cloudinary:", error);
        
        // Delete local file even if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return null;
    }
};

export default uploadOnCloudinary;