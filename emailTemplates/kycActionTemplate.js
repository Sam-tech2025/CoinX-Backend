// utils/emailTemplates/kycActionTemplate.js

/**
 * Generate email content for KYC status actions
 * @param {Object} params
 * @param {string} params.action - KYC action ("approved" | "rejected" | "paused" | "on-hold")
 * @param {string} [params.remarks] - Admin remarks
 * @param {Object} [params.user] - User info (optional)
 * @param {string} [params.user.fullName] - User full name (optional)
 * @returns {{ subject: string, html: string, text: string }}
 */


const getKycActionEmailContent = ({ action, remarks, user = {} }) => {
    const userName = user.fullName ? ` ${user.fullName.split(" ")[0]}` : user.userName;

    let subject = "";
    let html = "";
    let text = "";

    switch (action) {
        case "approved":
            subject = `✅ Your KYC has been approved`;
            html = `
                <h2 style="color:#22c55e;">KYC Approved</h2>
                <p>Dear${userName},</p>
                <p>We are pleased to inform you that your <strong>KYC verification</strong> has been <strong>approved</strong>.</p>
                <p>Remarks: ${remarks || "No additional remarks provided."}</p>
                <p>You can now access all account features without restriction.</p>
                <p>Thank you for verifying your identity with <strong>CoinX Invest</strong>.</p>
                <p>– The CoinX Team</p>
            `;
            text = `Your KYC verification has been approved. Remarks: ${remarks || "No remarks"}. You can now access all features.`;
            break;

        case "rejected":
            subject = `❌ Your KYC has been rejected`;
            html = `
                <h2 style="color:#ef4444;">KYC Rejected</h2>
                <p>Dear${userName},</p>
                <p>Unfortunately, your <strong>KYC verification</strong> has been <strong>rejected</strong>.</p>
                <p>Remarks: ${remarks || "No specific reason provided."}</p>
                <p>Please review your documents and resubmit the correct details for approval.</p>
                <p>If you believe this is an error, please contact our support team.</p>
                <p>– The CoinX Team</p>
            `;
            text = `Your KYC verification has been rejected. Remarks: ${remarks || "No remarks"}. Please re-upload valid documents.`;
            break;

        case "paused":
            subject = `⏸️ Your KYC verification is paused`;
            html = `
                <h2 style="color:#facc15;">KYC Paused</h2>
                <p>Dear${userName},</p>
                <p>Your <strong>KYC verification</strong> process is currently <strong>paused</strong>.</p>
                <p>Remarks: ${remarks || "No additional details provided."}</p>
                <p>Our compliance team is reviewing your documents and will update you shortly.</p>
                <p>– The CoinX Team</p>
            `;
            text = `Your KYC process is paused. Remarks: ${remarks || "No remarks"}. Our team will update you soon.`;
            break;

        case "on-hold":
            subject = `🕓 Your KYC verification is on hold`;
            html = `
                <h2 style="color:#60a5fa;">KYC On Hold</h2>
                <p>Dear${userName},</p>
                <p>Your <strong>KYC verification</strong> is currently <strong>on hold</strong>.</p>
                <p>Remarks: ${remarks || "Pending further verification."}</p>
                <p>We’ll notify you once the review is complete.</p>
                <p>– The CoinX Team</p>
            `;
            text = `Your KYC verification is on hold. Remarks: ${remarks || "No remarks"}. You will be notified once reviewed.`;
            break;

        default:
            subject = `Update on your KYC verification`;
            html = `
                <h2>KYC Status Update</h2>
                <p>Dear${userName},</p>
                <p>Your KYC verification status has been updated. Please log in to your account for details.</p>
                <p>– The CoinX Team</p>
            `;
            text = `Your KYC verification status has been updated. Check your account for details.`;
    }

    return { subject, html, text };
};

module.exports = { getKycActionEmailContent };
