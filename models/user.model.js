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
    otpCode: { type: String },
    otpExpires: { type: Date },
    phoneNumber: { type: String },
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
    refreshToken: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
