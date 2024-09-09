import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const uploadToCloudinary = async(LocalUrl) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
    });
    try {
        if(!LocalUrl) return null        
            const File = await cloudinary.uploader.upload(LocalUrl, {
                resource_type: "auto"
            })
            fs.unlinkSync(LocalUrl)
            return File
    } catch (error) {
        fs.unlink(LocalUrl)
        return null
    }
}

export {uploadToCloudinary}
