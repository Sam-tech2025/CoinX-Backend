
const mongoose = require("mongoose")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");


const kycSchema = new mongoose.Schema(
    {
        user: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },
            userName: String,
            email: String
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
            enum: ["pending", "approved", "rejected", "paused", "on-hold"],
            default: "pending",
        },

        // Admin who reviewed last
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
                    enum: ["submitted", "approved", "rejected", "paused", "on-hold"],
                },
                actionBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
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


kycSchema.plugin(aggregatePaginate)
kycSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("KycRequest", kycSchema)