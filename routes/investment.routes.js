const express = require("express")
const { commonErrors } = require("../errors/error")
const { createInvestmentController, getInvestmentByUserIdController } = require("../controller/investment.controller")
const router = express.Router()

router.post('/', createInvestmentController)

router.get('/user-id', getInvestmentByUserIdController)

router.use(commonErrors)

module.exports = router