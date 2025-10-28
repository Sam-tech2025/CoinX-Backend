// controllers/cloudinary.controller.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateSignature = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = `kyc/${req.body.userId || "unknown"}`;

        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({ timestamp, folder, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate signature" });
    }
};

module.exports = { generateSignature };
