const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const dayjs = require("dayjs");
const investmentModel = require("../models/investment.model");

const createInvestmentQuery = async (details) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, asset, amount, period, type, returns } = details;

        // 1️⃣ Validate User
        const checkUser = await userModel.findById(userId).session(session);

        if (!checkUser) {
            await session.abortTransaction();
            session.endSession();
            return {
                status: false,
                statusCode: 404,
                message: "User not found",
            };
        }

        // 2️⃣ Check Wallet Balance
        if (checkUser.walletBalance < Number(amount)) {
            await session.abortTransaction();
            session.endSession();
            return {
                status: false,
                statusCode: 400,
                message: "Insufficient wallet balance",
            };
        }

        // 3️⃣ Compute Dates
        const startDate = new Date();
        const endDate = dayjs(startDate).add(period, "month").toDate();

        // 4️⃣ Create Investment Record
        const newInvestment = await investmentModel.create(
            [
                {
                    userId,
                    asset,
                    amount,
                    period,
                    type,
                    returns,
                    startDate,
                    endDate,
                    status: "active",
                },
            ],
            { session }
        );

        // 5️⃣ Deduct Amount from Wallet
        checkUser.walletBalance -= Number(amount);
        await checkUser.save({ session });

        // 6️⃣ Commit Transaction
        await session.commitTransaction();
        session.endSession();

        return {
            status: true,
            statusCode: 201,
            message: "Investment created successfully",
            data: newInvestment[0],
            user: checkUser
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating investment:", error);

        return {
            status: false,
            statusCode: 500,
            message: error.message || "Failed to create investment",
        };
    }
};


const getInvestmentByUserIdQuery = async (userId, searchTerms, page, limit) => {
    try {

        const options = {
            page,
            limit,
            sort: { createdAt: -1 }
        }

        const filter = { userId }

        const investments = await investmentModel.paginate(filter, options)

        return {
            status: true,
            statusCode: 200,
            investments
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
    createInvestmentQuery,
    getInvestmentByUserIdQuery
};
