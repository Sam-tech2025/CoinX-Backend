const express = require("express")
const { commonErrors } = require("../errors/error")
const { createTransactionController, getUserTransactionController, actionOnTransactionController, getTransactionByUserIdController, getTransactionHisoryController } = require("../controller/transaction.controller")
const router = express.Router()

router.post('/', createTransactionController)

router.get('/all-user', getUserTransactionController)

router.post('/action', actionOnTransactionController)

router.get('/userId', getTransactionByUserIdController)

router.get('/history-by-transId', getTransactionHisoryController)

router.use(commonErrors)

module.exports = router