const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const { uploadImage } = require("../services/uploadImage");
const transactionHistoryModel = require("../models/transactionHistory.model");

const createTransactionQuery = async (details, image) => {
    try {
        console.log({ details, image })

        const {
            amount,
            currencyType,
            transactionId,
            transactionType,
            withdrawAddress,
        } = details;

        const userId = details.userId;

        if (transactionType === "add") {
            if (!amount || !currencyType || !transactionId || !transactionType) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "All fields are required."
                }
            }
        }

        if (transactionType === "withdraw") {
            if (!amount || !withdrawAddress) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "All fields are required."
                }
            }
        }

        // For withdrawal — user must have enough balance
        if (transactionType === "withdraw") {
            const user = await userModel.findById(userId);
            if (!user || user.walletBalance < amount) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Insufficient wallet balance for withdrawal."
                }
            }
        }

        let imageUrl = "";

        if (image) {
            imageUrl = await uploadImage(image, userId, 'transactions')
        }

        const newTransaction = await transactionModel.create({
            userId,
            amount,
            currencyType,
            transactionId,
            screenshot: imageUrl,
            transactionType,
            withdrawAddress,
        });

        return {
            status: true,
            statusCode: 201,
            message: transactionType === "add"
                ? "Deposit request submitted and pending admin approval."
                : "Withdrawal request submitted and pending admin approval.",
            transaction: newTransaction
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getUserTransactionQuery = async (status, page, limit) => {
    try {
        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: [
                { path: "userId", select: "userName email" },
                { path: "actionTakenBy", select: "userName email" }
            ]
        }

        let filter = {}

        if (status && status !== "all") {
            filter.status = { $regex: `^${status}`, $options: "i" }
        }

        const transactions = await transactionModel.paginate(filter, options)
        return {
            status: true,
            statusCode: 200,
            transactions
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getTransactionByUserIdQuery = async (userId, status = [], transactionType = [], dateRange = {}, searchTerm = "", page, limit) => {
    try {

        status = JSON.parse(status)
        transactionType = JSON.parse(transactionType)

        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
            populate: [
                { path: "actionTakenBy", select: "userName email" }
            ]
        };

        const filter = { userId };

        if (Array.isArray(status) && status.length > 0) {
            filter.status = { $in: status.map(s => new RegExp(`^${s}$`, "i")) };
        } else if (Array.isArray(transactionType) && transactionType.length > 0) {
            filter.transactionType = { $in: transactionType.map(t => new RegExp(`${t}$`, "i")) }
        }


        if (dateRange.start || dateRange.end) {
            filter.createdAt = {}
            if (dateRange.start) filter.createdAt.$gte = new Date(dateRange.start)
            if (dateRange.end) filter.createdAt.$lte = new Date(dateRange.end)
        }

        // ✅ Apply searchTerm if provided
        if (searchTerm && typeof searchTerm === "string" && searchTerm.trim() !== "") {
            const regex = new RegExp(searchTerm.trim(), "i");

            // Detect if the search term looks numeric
            const isNumeric = !isNaN(Number(searchTerm.trim()));

            // Build OR conditions
            const orConditions = [
                { transactionId: regex },
                { transactionType: regex },
                { status: regex },
                { "actionTakenBy.userName": regex },
                { "actionTakenBy.email": regex },
            ];

            // ✅ Only add amount condition if it’s numeric
            if (isNumeric) {
                orConditions.push({ amount: Number(searchTerm.trim()) });
            }

            filter.$or = orConditions;
        }


        const transactions = await transactionModel.paginate(filter, options);

        return {
            status: true,
            statusCode: 200,
            transactions
        };
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};


const actionOnTransactionQuery = async (details) => {
    try {
        const { userId: adminId, transactionId, action, reason } = details;

        // ✅ Validate input early
        if (!["approved", "rejected", "on-hold", "pause"].includes(action)) {
            return { status: false, statusCode: 400, message: "Invalid action" };
        }

        // ✅ Fetch only required fields
        const transaction = await transactionModel
            .findById(transactionId)
            .select("status transactionType amount userId");

        if (!transaction) {
            return { status: false, statusCode: 404, message: "Transaction not found" };
        }

        // ✅ Prevent duplicate processing (status check corrected)
        if (transaction.status === action) {
            return { status: false, statusCode: 400, message: "Transaction already processed" };
        }

        // ✅ Start session for atomic transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let updateOps = {
                status: action,
                remarks: reason || "No remarks",
                actionTakenBy: adminId,
                actionTakenAt: new Date(),
            };

            // ✅ Wallet updates based on action & transactionType
            if (action === "approved") {
                if (transaction.transactionType === "add") {
                    await userModel.updateOne(
                        { _id: transaction.userId },
                        { $inc: { walletBalance: transaction.amount } },
                        { session }
                    );
                } else if (transaction.transactionType === "withdraw") {
                    const user = await userModel.findById(transaction.userId).select("walletBalance").session(session);

                    if (!user) throw new Error("User not found");
                    if (user.walletBalance < transaction.amount) {
                        await session.abortTransaction();
                        session.endSession();
                        return {
                            status: false,
                            statusCode: 400,
                            message: "Insufficient balance for withdrawal",
                        };
                    }

                    await userModel.updateOne(
                        { _id: user._id },
                        { $inc: { walletBalance: -transaction.amount } },
                        { session }
                    );
                }
            }

            // ✅ Update transaction atomically
            const updatedTransaction = await transactionModel.findByIdAndUpdate(
                transactionId,
                { $set: updateOps },
                { new: true, session }
            );

            // ✅ Commit atomic operation
            await session.commitTransaction();
            session.endSession();

            return {
                status: true,
                statusCode: 200,
                message: `Transaction ${action} successfully`,
                transaction: updatedTransaction,
            };
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (error) {
        console.error("Transaction Action Error:", error);
        return { status: false, statusCode: 500, message: error.message };
    }
};


const getTransactionHisoryQuery = async (transId) => {
    try {

        console.log({ transId })

        if (!mongoose.Types.ObjectId.isValid(transId)) {
            return { status: false, statusCode: 400, message: "Invalid transaction ID" };
        }

        const history = await transactionHistoryModel.find({ transactionId: transId })
            .populate("newData.userId", "userName email")
            .populate("oldData.userId", "userName email")
            .populate("oldData.actionTakenBy", "userName email")
            .populate("newData.actionTakenBy", "userName email")

        return {
            status: true,
            statusCode: 200,
            data: history
        };
    } catch (error) {
        console.log("Transaction history Error:", error);
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
}

module.exports = {
    createTransactionQuery,
    getUserTransactionQuery,
    actionOnTransactionQuery,
    getTransactionByUserIdQuery,
    getTransactionHisoryQuery
}