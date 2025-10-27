// // models/transactionHistory.model.js
// const mongoose = require("mongoose");

// const TransactionHistorySchema = new mongoose.Schema(
//     {
//         transactionId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Transaction",
//             required: true,
//         },
//         changedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             default: null,
//         },
//         oldData: {
//             type: Object,
//             default: {},
//         },
//         newData: {
//             type: Object,
//             default: {},
//         },
//         changeType: {
//             type: String,
//             enum: ["create", "update", "delete"],
//             required: true,
//         },
//         remarks: {
//             type: String,
//             default: null,
//         },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("TransactionHistory", TransactionHistorySchema);


// models/transactionHistory.model.js
const mongoose = require("mongoose");

const TransactionHistorySchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true,
        },
        changeType: {
            type: String,
            enum: ["create", "update", "delete"],
            required: true,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        remarks: { type: String, default: null },

        // Capture old and new snapshots
        oldData: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            amount: Number,
            currencyType: String,
            transactionId: String,
            screenshot: String,
            status: String,
            transactionType: String,
            actionTakenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            actionTakenAt: Date,
            remarks: String,
            createdAt: Date,
            updatedAt: Date,
        },
        newData: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            amount: Number,
            currencyType: String,
            transactionId: String,
            screenshot: String,
            status: String,
            transactionType: String,
            actionTakenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            actionTakenAt: Date,
            remarks: String,
            createdAt: Date,
            updatedAt: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TransactionHistory", TransactionHistorySchema);
