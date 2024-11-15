const cloudin = require("../controller/cloudUpload");

async function imageUpload(registerNumber, files) {
    const imageUrls = [];
    try {
        // Loop through each file and upload to Cloudinary
        
        return imageUrls;
    } catch (error) {
        console.error(`Error uploading images for ${registerNumber}:`, error);
        throw new Error('Image upload failed');
    }
}

module.exports = imageUpload;