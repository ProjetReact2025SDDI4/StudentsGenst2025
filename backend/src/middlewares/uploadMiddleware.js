import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Stockage pour les documents (PDF, etc)
const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'formationsGest/documents',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw'
    }
});

// Stockage pour les images (Vignettes formations, etc)
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'formationsGest/images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 600, crop: 'limit' }]
    }
});

export const documentUpload = multer({ storage: documentStorage });
export const imageUpload = multer({ storage: imageStorage });

export default { documentUpload, imageUpload };
