const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    profilePhotoUrl: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String, unique: true, trim: true, required: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    kycStatus: { type: String, enum: ["approved", "pending", "reject", "pause", "hold"], default: "pending" },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationTime: { type: Date },
    walletBalance: { type: Number, default: 0 },
    otpCode: { type: String },
    otpExpires: { type: Date },
    phoneNumber: { type: String },
    landlineNumber: { type: String },
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
    refreshToken: { type: String, default: null },
    country: { type: String },
    city: { type: String },
    pincode: { type: String },
    address: { type: String },
    bitcoinAddress: { type: String },
    usdtAddress: { type: String },
    telegramUsername: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
