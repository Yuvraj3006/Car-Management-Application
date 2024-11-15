const cloudinary = require("cloudinary").v2
require('dotenv').config()
const fs = require('fs');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_USER, 
    api_key: process.env.CLOUDINARY__KEY, 
    api_secret: process.env.CLOUDINARY__SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Uploading the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect resource type
        });

        // Log success and return the response
        console.log("File uploaded successfully:", response.url);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response.secure_url;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);

        // Attempt to delete the local file if it exists
        

        return null;
    }
};

module.exports = uploadOnCloudinary;