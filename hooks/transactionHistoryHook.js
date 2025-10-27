// // hooks/transactionHistoryHook.js
// const TransactionHistory = require("../models/transactionHistory.model");

// module.exports = function attachTransactionHooks(TransactionSchema) {
//     // After creating a transaction
//     TransactionSchema.post("save", async function (doc, next) {
//         try {
//             await TransactionHistory.create({
//                 transactionId: doc._id,
//                 changeType: "create",
//                 newData: doc.toObject(),
//                 changedBy: doc.actionTakenBy || doc.userId,
//             });
//             next();
//         } catch (err) {
//             console.error("Error logging creation history:", err);
//             next(err);
//         }
//     });

//     // After updating a transaction
//     TransactionSchema.post("findOneAndUpdate", async function (doc, next) {
//         try {
//             if (!doc) return next();

//             const changes = this.getUpdate(); // get fields that were updated

//             await TransactionHistory.create({
//                 transactionId: doc._id,
//                 changeType: "update",
//                 oldData: doc.toObject(), // pre-update snapshot
//                 newData: changes,
//                 changedBy: doc.actionTakenBy || doc.userId,
//             });

//             next();
//         } catch (err) {
//             console.error("Error logging update history:", err);
//             next(err);
//         }
//     });

//     // After deleting a transaction
//     TransactionSchema.post("findOneAndDelete", async function (doc, next) {
//         try {
//             if (!doc) return next();
//             await TransactionHistory.create({
//                 transactionId: doc._id,
//                 changeType: "delete",
//                 oldData: doc.toObject(),
//                 changedBy: doc.actionTakenBy || doc.userId,
//             });
//             next();
//         } catch (err) {
//             console.error("Error logging delete history:", err);
//             next(err);
//         }
//     });
// };




// hooks/transactionHistoryHook.js
const TransactionHistory = require("../models/transactionHistory.model");

module.exports = function attachTransactionHooks(TransactionSchema) {
    // After creating a transaction
    TransactionSchema.post("save", async function (doc, next) {
        try {
            await TransactionHistory.create({
                transactionId: doc._id,
                changeType: "create",
                newData: doc.toObject(),
                changedBy: doc.actionTakenBy || doc.userId,
            });
            next();
        } catch (err) {
            console.error("Error logging creation history:", err);
            next(err);
        }
    });

    // After updating a transaction
    TransactionSchema.post("findOneAndUpdate", async function (doc, next) {
        try {
            if (!doc) return next();

            const changes = this.getUpdate();
            const updatedDoc = await this.model.findOne(this.getQuery());
            console.log("updated doc checkiing", updatedDoc)

            await TransactionHistory.create({
                transactionId: doc._id,
                changeType: "update",
                oldData: updatedDoc.toObject(), // pre-update snapshot
                newData: doc.toObject(), // post-update snapshot
                changedBy: doc.actionTakenBy || doc.userId,
            });

            next();
        } catch (err) {
            console.error("Error logging update history:", err);
            next(err);
        }
    });

    // After deleting a transaction
    TransactionSchema.post("findOneAndDelete", async function (doc, next) {
        try {
            if (!doc) return next();
            await TransactionHistory.create({
                transactionId: doc._id,
                changeType: "delete",
                oldData: doc.toObject(),
                changedBy: doc.actionTakenBy || doc.userId,
            });
            next();
        } catch (err) {
            console.error("Error logging delete history:", err);
            next(err);
        }
    });
};
