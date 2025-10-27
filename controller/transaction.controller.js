const { createTransactionQuery, getUserTransactionQuery, actionOnTransactionQuery, getTransactionByUserIdQuery, getTransactionHisoryQuery } = require("../query/transaction.query")


const createTransactionController = async (req, res, next) => {
    try {
        const response = await createTransactionQuery(req.body, req.files ? req.files.screenshot : null)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getUserTransactionController = async (req, res, next) => {
    try {
        const { searchTerm, status = [], transactionType = [], dateRange, page, limit } = req.query
        console.log(dateRange)
        let parsedDateRange = {}
        if (dateRange) {
            try {
                parsedDateRange = JSON.parse(dateRange)
            } catch (e) {
                console.log(e)
            }
        }
        console.log({ parsedDateRange })
        const response = await getUserTransactionQuery(searchTerm, status, transactionType, parsedDateRange, page || 1, limit || 10)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const actionOnTransactionController = async (req, res, next) => {
    try {
        const response = await actionOnTransactionQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getTransactionByUserIdController = async (req, res, next) => {
    try {
        const { userId, status = [], transactionType = [], dateRange, searchTerm, page, limit } = req.query;

        console.log({ searchTerm })

        let parsedDateRange = {}
        if (dateRange) {
            try {
                parsedDateRange = JSON.parse(dateRange)
            } catch (e) {
                console.log()
            }
        }
        console.log("userId:", userId, "status:", status, transactionType, parsedDateRange, "page:", page, "limit:", limit);

        const response = await getTransactionByUserIdQuery(
            userId,
            status,
            transactionType,
            parsedDateRange,
            searchTerm,
            Number(page) || 1,
            Number(limit) || 10
        );

        return res.send(response);
    } catch (error) {
        next(error);
    }
};


const getTransactionHisoryController = async (req, res, next) => {
    try {
        console.log(req.query.transactionId)
        const response = await getTransactionHisoryQuery(req.query.transactionId)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createTransactionController,
    getUserTransactionController,
    actionOnTransactionController,
    getTransactionByUserIdController,
    getTransactionHisoryController
}