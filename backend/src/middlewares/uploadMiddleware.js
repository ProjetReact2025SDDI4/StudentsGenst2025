import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const documentMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
];

const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
];

const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        const ext = (path.extname(file.originalname) || '').replace('.', '').toLowerCase();
        const baseName = path.basename(file.originalname, path.extname(file.originalname));

        return {
            folder: 'formationsGest/documents',
            resource_type: 'raw',
            allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
            public_id: `${Date.now()}_${baseName}`.replace(/\s+/g, '_'),
            format: ext || undefined
        };
    }
});

const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'formationsGest/images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 600, crop: 'limit' }]
    }
});

export const documentUpload = multer({
    storage: documentStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (documentMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé'));
        }
    }
});

export const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (imageMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé'));
        }
    }
});

export default { documentUpload, imageUpload };
