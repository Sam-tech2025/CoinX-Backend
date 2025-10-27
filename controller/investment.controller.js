const { createInvestmentQuery, getInvestmentByUserIdQuery } = require("../query/investment.query")



const createInvestmentController = async (req, res, next) => {
    try {
        const response = await createInvestmentQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getInvestmentByUserIdController = async (req, res, next) => {
    try {
        const { userId, searchTerms, page, limit } = req.query
        const response = await getInvestmentByUserIdQuery(userId, searchTerms, Number(page) || 1, Number(limit) || 10)

        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createInvestmentController,
    getInvestmentByUserIdController
}