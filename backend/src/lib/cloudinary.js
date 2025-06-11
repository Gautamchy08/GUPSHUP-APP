import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'

config()

// Initialize cloudinary with my environment variables or can say credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET
})

export default cloudinary
