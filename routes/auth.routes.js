const express = require("express")
const { authController, refreshController, logoutController, signUpController, verifyOtpController, uploadUserProfileImageController, updateUserPersonalInfoController, updateUserAddressInfoController, updateUserCryptoInfoController, getUserWalletBalanceController } = require("../controller/auth.controller")
const { commonErrors } = require("../errors/error")
const router = express.Router()

router.post('/sign-in', authController)

router.post('/sign-up', signUpController)

router.post("/verify-otp", verifyOtpController)

router.post('/refresh', refreshController)

router.post('/logout', logoutController)

router.post("/profile-picture", uploadUserProfileImageController)

router.post("/personal-information", updateUserPersonalInfoController)

router.post("/address-information", updateUserAddressInfoController)

router.post("/crypto-information", updateUserCryptoInfoController)

router.get("/get-user-info", getUserWalletBalanceController)

router.use(commonErrors)

module.exports = router