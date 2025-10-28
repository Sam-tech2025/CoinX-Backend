// services/uploadImage.js
const streamifier = require("streamifier");
const { default: cloudinary } = require("../utils/cloudinary");

const uploadImageStream = (fileBuffer, folder = "kyc") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder }, // you can pass unique user folder like `kyc/${userId}`
            (error, result) => {
                if (error) return reject(error);
                console.log("secure url", result.secure_url)
                resolve(result.secure_url); // return the file URL
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

module.exports = { uploadImageStream };
