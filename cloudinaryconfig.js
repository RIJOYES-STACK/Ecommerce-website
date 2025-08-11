const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// setup multer with cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecommerce-products",
        allowed_formats: ['jpg', 'png', 'jpeg']
    },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };