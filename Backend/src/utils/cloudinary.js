import {v2 as cloudinary} from "cloudinary"
import fs from "node:fs/promises"

const uploadToCloudinary = async(LocalUrl) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
    });
    try {
        if (!LocalUrl) return null;
        const file = await cloudinary.uploader.upload(LocalUrl, {
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        });
        await fs.unlink(LocalUrl).catch(() => {});
        return file;
    } catch (error) {
        await fs.unlink(LocalUrl).catch(() => {});
        console.error("Cloudinary image upload failed:", error.message);
        return null
    }
}

export {uploadToCloudinary}
