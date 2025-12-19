import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config() 
// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqswf244s',
  api_key: process.env.CLOUDINARY_API_KEY || '945682592389545',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'PNZrfIhi8GyKe-QjcrWU3QuLsw0',
})


// Multer storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'ecomerce project 1', // Folder name
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // optional
      public_id: file.originalname.split('.')[0],
    }
  },
})


export { cloudinary, storage }
