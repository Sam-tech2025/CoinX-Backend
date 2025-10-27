const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2")

const InvestmentReturnsSchema = new mongoose.Schema(
    {
        investment: { type: Number, required: true }, // Principal amount
        monthlyReturn: { type: Number, required: true },
        totalReturn: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        bonus: { type: Number, default: 0 },
        totalReturnPercent: { type: Number, required: true },
        annualReturnPercent: { type: Number, required: true },
        selectedMonths: { type: Number, required: true },
    },
    { _id: false } // Don’t need a separate _id for embedded document
);

const InvestmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // frequent filter
        },

        asset: {
            type: String,
            enum: ["BTC", "ETH", "SOLANA", "USDT", "USDC", "BNB"],
            required: true,
            index: true, // for filtering by asset type
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        period: {
            type: Number, // months
            required: true,
            min: 1,
        },

        type: {
            type: String,
            enum: ["flexible", "locked"],
            required: true,
            index: true,
        },

        returns: {
            type: InvestmentReturnsSchema,
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "completed", "cancelled", "paused"],
            default: "active",
            index: true,
        },

        startDate: {
            type: Date,
            default: Date.now,
            index: true,
        },

        endDate: {
            type: Date,
            required: false,
        },

        closedAt: {
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

InvestmentSchema.plugin(aggregatePaginate);
InvestmentSchema.plugin(mongoosePaginate);


// ✅ Index combinations for performance
InvestmentSchema.index({ userId: 1, status: 1 });
InvestmentSchema.index({ asset: 1, type: 1 });
InvestmentSchema.index({ startDate: -1 });

module.exports = mongoose.model("Investment", InvestmentSchema);
