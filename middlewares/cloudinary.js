const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // You can specify a folder in Cloudinary where uploads are saved
    format: async (req, file) => {
      // "png", // Or whatever file format you prefer
      //e.g., JPEG, PNG, GIF
      // Check if the file's MIME type is in the allowed formats
      const mimeType = file.mimetype;
      if (allowedFormats.includes(mimeType)) {
        // Return the correct format based on MIME type
        return mimeType.split("/")[1]; // e.g., "jpeg" from "image/jpeg"
      } else {
        throw new Error("Unsupported file format");
      }
    },
    public_id: (req, file) => file.originalname.split(".")[0], // Use the original filename
  },
});

/*
for local uploads in your system or as a folder
// const uploadMiddleware = multer({
//   dest: "uploads",
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB file size limit
//     fieldSize: 10 * 1024 * 1024,
//   },
// });

*/

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;
