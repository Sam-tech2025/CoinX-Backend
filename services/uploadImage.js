// import cloudinary from "../utils/cloudinary.js";

// export const uploadImage = async (file) => {
//     try {
//         if (!file || !file.tempFilePath) throw new Error("No file provided");

//         // ✅ Upload directly from the temp file path
//         const result = await cloudinary.uploader.upload(file.tempFilePath, {
//             folder: "news_images",
//             resource_type: "image",
//         });

//         return result.secure_url;
//     } catch (err) {
//         console.error("Cloudinary Upload Error:", err);
//         throw new Error("Image upload failed");
//     }
// };



import cloudinary from "../utils/cloudinary.js";

export const uploadImage = async (file, userId, folderName) => {
    try {
        if (!file || !file.tempFilePath) throw new Error("No file provided");

        // Define a unique and consistent public_id for the user's profile image
        const publicId = `coinx/${folderName}/${userId}`;

        // Upload and overwrite the existing image with the same public_id
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: publicId,
            overwrite: true, // ✅ This replaces the old image
            folder: "user_profiles",
            resource_type: "image",
        });

        return result.secure_url;
    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        throw new Error("Image upload failed");
    }
};
