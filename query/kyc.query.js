const { getKycActionEmailContent } = require("../emailTemplates/kycActionTemplate");
const { getNewKycRequestEmailContent } = require("../emailTemplates/newKycRequestTemplate");
const kycModel = require("../models/kyc.model");
const userModel = require("../models/user.model");
const { sendMail } = require("../services/mailService");


// const kycRequestQuery = async (details, idFront, idBack, selfie) => {
//     try {
//         const { userId, country } = details;

//         const user = await userModel.findById(userId);
//         if (!user) {
//             return {
//                 status: false,
//                 statusCode: 404,
//                 message: "User not found",
//             };
//         }

//         // ✅ Upload images in parallel
//         const [frontUrl, backUrl, selfieUrl] = await Promise.all([
//             uploadImageStream(idFront.data, `kyc/${userId}`),
//             uploadImageStream(idBack.data, `kyc/${userId}`),
//             uploadImageStream(selfie.data, `kyc/${userId}`),
//         ]);

//         // ✅ Save KYC record
//         const kyc = await kycModel.create({
//             userId,
//             country,
//             documents: {
//                 idFront: frontUrl,
//                 idBack: backUrl,
//                 selfie: selfieUrl,
//             },
//             status: "pending",
//             history: [{ action: "submitted" }],
//         });

//         return {
//             status: true,
//             statusCode: 201,
//             message: "KYC documents uploaded successfully and pending verification.",
//             kyc,
//         };
//     } catch (error) {
//         console.error("❌ KYC Upload Error:", error);
//         return {
//             status: false,
//             statusCode: 500,
//             message: error.message,
//         };
//     }
// }


const kycRequestQuery = async (details) => {
    const { userId, country, documents } = details;

    const user = await userModel.findById(userId);
    if (!user) return { status: false, statusCode: 404, message: "User not found" };

    const userDetails = {
        userId: userId,
        email: user.email,
        userName: user.userName
    }


    const kyc = await kycModel.create({
        user: userDetails,
        country,
        documents,
        status: "pending",
        history: [{ action: "submitted" }],
    });

    const emailContent = getNewKycRequestEmailContent({
        user,
        country,
        documents,
        kycId: kyc._id,
    });

    await sendMail({
        to: "sumangaldey8972@gmail.com",
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
    });


    return {
        status: true,
        statusCode: 201,
        message: "KYC submitted successfully.",
        kyc,
    };
};


const getKycRequestByUserIdQuery = async (userId) => {
    try {

        const kyc = await kycModel.find({ "user.userId": userId })
            .populate({ path: "reviewedBy", select: "userName email" })

        if (!kyc) {
            return {
                status: false,
                statusCode: 404,
                message: "KYC record not found for this user.",
            };
        }

        return {
            status: true,
            statusCode: 200,
            message: "KYC record fetched successfully.",
            kyc,
        };


    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const takeActionOnKycRequestQuery = async (details) => {
    try {
        console.log(details)
        const { status, remarks, userId, adminId, kycId } = details

        const existingKycRequest = await kycModel.findOne({ _id: kycId })
        const exisitingUser = await userModel.findOne({ _id: userId })

        if (!exisitingUser) {
            return {
                status: true,
                statusCode: 404,
                message: "User not found"
            }
        }

        if (!existingKycRequest) {
            return {
                status: false,
                statusCode: 404,
                message: "Kyc Record not found"
            }
        }

        existingKycRequest.reviewedBy = adminId;
        existingKycRequest.status = status;
        existingKycRequest.remarks = remarks;
        existingKycRequest.history.push({ action: status, actionBy: adminId, remarks: remarks })

        if (status === "approved") {
            exisitingUser.kycStatus = status
            await exisitingUser.save()
        }

        await existingKycRequest.save()

        const emailContent = getKycActionEmailContent({
            action: status,
            remarks,
            user: exisitingUser,
        });

        await sendMail({
            to: exisitingUser.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
        });

        return {
            status: true,
            statusCode: 200,
            message: `Kyc status updated to ${status}`,
            existingKycRequest,
            exisitingUser
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getUserKycRequestQuery = async (searchTerm, status = [], dateRange = {}, page, limit) => {
    try {

        status = JSON.parse(status)

        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: [
                { path: "reviewedBy", select: "userName email" }
            ]
        }

        let filter = {}

        if (Array.isArray(status) && status.length > 0) {
            filter.status = { $in: status.map(s => new RegExp(`^${s}$`, "i")) };
        }

        if (dateRange.start || dateRange.end) {
            filter.createdAt = {}
            if (dateRange.start) filter.createdAt.$gte = new Date(dateRange.start)
            if (dateRange.end) filter.createdAt.$lte = new Date(dateRange.end)
        }

        const kyc = await kycModel.paginate(filter, options)
        return {
            status: true,
            statusCode: 200,
            kyc
        }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

module.exports = {
    kycRequestQuery,
    getKycRequestByUserIdQuery,
    takeActionOnKycRequestQuery,
    getUserKycRequestQuery
}