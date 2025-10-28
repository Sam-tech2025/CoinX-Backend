const { kycRequestQuery, getKycRequestByUserIdQuery, takeActionOnKycRequestQuery, getUserKycRequestQuery } = require("../query/kyc.query")



// const kycRequestController = async (req, res, next) => {
//     try {
//         const response = await kycRequestQuery(req.body, req.files.idFront, req.files.idBack, req.files.selfie)
//         return res.send(response)
//     } catch (error) {
//         next(error)
//     }
// }

const kycRequestController = async (req, res, next) => {
    try {
        console.log(req.body)
        const response = await kycRequestQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const getKycRequestByUserIdController = async (req, res, next) => {
    try {
        const response = await getKycRequestByUserIdQuery(req.query.userId)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const takeActionOnKycRequestController = async (req, res, next) => {
    try {
        const response = await takeActionOnKycRequestQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}




const getUserKycRequestController = async (req, res, next) => {
    try {
        const { searchTerm, status = [], dateRange, page, limit } = req.query
        console.log(dateRange)
        let parsedDateRange = {}
        if (dateRange) {
            try {
                parsedDateRange = JSON.parse(dateRange)
            } catch (e) {
                console.log(e)
            }
        }

        const response = await getUserKycRequestQuery(searchTerm, status, parsedDateRange, page || 1, limit || 10)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    kycRequestController,
    getKycRequestByUserIdController,
    takeActionOnKycRequestController,
    getUserKycRequestController
}