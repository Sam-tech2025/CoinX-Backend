// models/transaction.model.js
const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const attachTransactionHooks = require("../hooks/transactionHistoryHook")

const TransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currencyType: {
            type: String,
            enum: ["btc", "usdt"],
            required: true,
        },
        transactionId: {
            type: String,
            required: false,
            maxlength: 512,
        },
        screenshot: String,
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "pause", "on-hold"],
            default: "pending",
        },
        transactionType: {
            type: String,
            enum: ["add", "withdraw"],
            required: true,
        },
        actionTakenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        actionTakenAt: {
            type: Date,
            default: null,
        },
        remarks: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

TransactionSchema.plugin(aggregatePaginate);
TransactionSchema.plugin(mongoosePaginate);

attachTransactionHooks(TransactionSchema)


module.exports = mongoose.model("Transaction", TransactionSchema);
