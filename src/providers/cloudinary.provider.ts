import configService from "@/config/config";
import { v2 as cloudinary } from "cloudinary";
export const cloudinaryProvider = cloudinary.config({
    cloud_name: configService.CLOUDINARY_CLOUD_NAME,
    api_key: configService.CLOUDINARY_API_KEY,
    api_secret: configService.CLOUDINARY_API_SECRET,
    secure_distribution: configService.CLOUDINARY_URL,
    upload_prefix: configService.CLOUDINARY_UPLOAD_PRESET
});