const userModel = require("../models/user.model");
const { signAccessToken, signRefreshToken } = require("../services/jwt.service");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../services/mailService");

const authQuery = async (details) => {
    try {
        const { userName, password } = details;

        const identifier = details.userName


        if (!userName || !password) {
            return { status: false, statusCode: 400, message: "email and password is required" };
        }

        const user = identifier.includes("@") ? await userModel.findOne({ email: identifier }) : await userModel.findOne({ userName: identifier });
        if (!user) {
            return { status: false, statusCode: 401, message: "invalid email or username" };
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return { status: false, statusCode: 401, message: "invalid password" };
        }

        const accessToken = signAccessToken({ sub: user._id, role: user.role, email: user.email });
        const refreshToken = signRefreshToken({ sub: user._id });

        user.refreshToken = refreshToken;
        await user.save();

        return {
            status: true,
            statusCode: 200,
            message: "Logged in. Welcome!",
            accessToken,
            refreshToken,
            user
        };
    } catch (error) {
        console.log(error)
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
};


const signUpQuery = async (details) => {
    try {

        const { userName, email, password } = details

        const existingUser = await userModel.findOne({ email })

        if (existingUser && existingUser.isVerified) {
            return {
                status: false,
                statusCode: 400,
                message: "Email already registerd and verified. Try to logged in"
            }
        }

        if (existingUser && !existingUser.isVerified) {
            const otpExpired = existingUser.otpExpires < Date.now()

            if (otpExpired) {
                await userModel.deleteOne({ email })
            } else {
                const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
                existingUser.otpCode = newOtp;
                existingUser.otpExpires = Date.now() + 1 * 60 * 1000; // 10 min expiry
                await existingUser.save()

                // need to trigger email

                await sendMail({
                    to: existingUser.email,
                    subject: "Your CoinX OTP for Verification",
                    html: `<h3>Verification OTP</h3>
                    <p>Your OTP is <b>${newOtp}</b></p>
                    <p>It will expire in 1 minutes.</p>`,
                })

                return {
                    status: true,
                    statusCode: 200,
                    message: "OTP is resent to your email"
                }

            }
        }


        const hashedPassword = await bcrypt.hash(password, 10)
        const otp = Math.floor(100000 + Math.random() * 90000).toString()

        const newUser = await userModel.create({
            userName,
            email,
            password: hashedPassword,
            otpCode: otp,
            otpExpires: Date.now() + 1 * 60 * 1000

        })

        await sendMail({
            to: newUser.email,
            subject: "Your CoinX OTP for Verification",
            html: `<h3>Verification OTP</h3>
                <p>Your OTP is <b>${otp}</b></p>
                <p>It will expire in 1 minutes.</p>`,
        })

        return {
            status: true,
            statusCode: 200,
            message: "User registered successfully. Please verify OTP sent to your email.",
            newUser
        }


    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const verifyOtpQuery = async (details) => {
    try {
        console.log(details)
        const { email, otp } = details

        const user = await userModel.findOne({ email })
        console.log({ user })
        if (!user) return { status: false, statusCode: 400, message: "User not found" }

        if (user.isVerified) return { status: false, statusCode: 400, message: "User already verified" }

        if (user.otpExpires < Date.now()) {
            return {
                status: false,
                statusCode: 400,
                message: "OTP expired, please sign up again"
            }
        }

        if (user.otpCode != otp) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid OTP"
            }
        }

        await userModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    isVerified: true,
                    verificationTime: new Date()
                },
                $unset: {
                    otpCode: "",
                    otpExpires: ""
                }
            },
            { new: true }
        )

        return {
            status: true,
            statusCode: 200,
            message: "Email verified successfully"
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

module.exports = {
    authQuery,
    signUpQuery,
    verifyOtpQuery
};
