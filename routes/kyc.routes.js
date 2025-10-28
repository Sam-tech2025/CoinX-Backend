const express = require("express")
const { commonErrors } = require("../errors/error")
const { kycRequestController, getKycRequestByUserIdController, takeActionOnKycRequestController, getUserKycRequestController } = require("../controller/kyc.controller")
const router = express.Router()

router.post('/', kycRequestController)

router.get('/by-user-id', getKycRequestByUserIdController)

router.post('/action', takeActionOnKycRequestController)

router.get('/all-user', getUserKycRequestController)

router.use(commonErrors)

module.exports = router