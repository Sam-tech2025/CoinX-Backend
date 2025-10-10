
const mongoose = require("mongoose")

const kycSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Country of the user
        country: {
            type: String,
            required: true,
            trim: true,
        },

        // Uploaded documents
        documents: {
            idFront: {
                type: String, // Cloud URL or file path
                required: true,
            },
            idBack: {
                type: String,
                required: true,
            },
            selfie: {
                type: String,
                required: true,
            },
            // Optional extra documents (like proof of address)
            additional: [
                {
                    name: String,
                    url: String,
                },
            ],
        },

        // Current KYC status
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paused", "on_hold"],
            default: "pending",
        },

        // Admin who reviewed last
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },

        // Admin remarks or reason (like rejection reason)
        remarks: {
            type: String,
            trim: true,
            default: "",
        },

        // Optional: track changes over time
        history: [
            {
                action: {
                    type: String,
                    enum: ["submitted", "approved", "rejected", "paused", "on_hold"],
                },
                actionBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Admin",
                },
                remark: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],

        // System flags
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("KycRequest", kycSchema)