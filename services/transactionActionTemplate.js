// utils/emailTemplates/transactionActionTemplate.js

const getTransactionActionEmailContent = ({ action, transaction, remarks }) => {
    const { amount, transactionType, currencyType } = transaction;

    const formattedAmount = `${amount} ${currencyType.toUpperCase()}`;
    let subject = "";
    let html = "";
    let text = "";

    switch (action) {
        case "approved":
            subject = `✅ Your ${transactionType} request has been approved`;
            html = `
        <h2>Transaction Approved</h2>
        <p>Dear user,</p>
        <p>Your <strong>${transactionType}</strong> request of <strong>${formattedAmount}</strong> has been <strong>approved</strong>.</p>
        <p>Remarks: ${remarks || "No additional remarks provided."}</p>
        <p>The amount has been successfully ${transactionType === "add" ? "added to" : "deducted from"
                } your wallet.</p>
        <p>Thank you for using CoinX Invest.</p>
        <p>– The CoinX Team</p>
      `;
            text = `Your ${transactionType} request of ${formattedAmount} has been approved. Remarks: ${remarks || "No remarks"}.`;
            break;

        case "rejected":
            subject = `❌ Your ${transactionType} request has been rejected`;
            html = `
        <h2>Transaction Rejected</h2>
        <p>Dear user,</p>
        <p>Unfortunately, your <strong>${transactionType}</strong> request of <strong>${formattedAmount}</strong> has been <strong>rejected</strong>.</p>
        <p>Remarks: ${remarks || "No specific reason provided."}</p>
        <p>Please review the details or contact support if you believe this was an error.</p>
        <p>– The CoinX Team</p>
      `;
            text = `Your ${transactionType} request of ${formattedAmount} has been rejected. Remarks: ${remarks || "No remarks"}.`;
            break;

        case "pause":
            subject = `⏸️ Your ${transactionType} request is paused`;
            html = `
        <h2>Transaction Paused</h2>
        <p>Dear user,</p>
        <p>Your <strong>${transactionType}</strong> request of <strong>${formattedAmount}</strong> is currently <strong>paused</strong>.</p>
        <p>Remarks: ${remarks || "No details provided."}</p>
        <p>Our team is reviewing the issue and will update you shortly.</p>
        <p>– The CoinX Team</p>
      `;
            text = `Your ${transactionType} request of ${formattedAmount} is paused. Remarks: ${remarks || "No remarks"}.`;
            break;

        case "on-hold":
            subject = `🕓 Your ${transactionType} request is on hold`;
            html = `
        <h2>Transaction On Hold</h2>
        <p>Dear user,</p>
        <p>Your <strong>${transactionType}</strong> request of <strong>${formattedAmount}</strong> is currently <strong>on hold</strong>.</p>
        <p>Remarks: ${remarks || "Pending further verification."}</p>
        <p>We’ll notify you as soon as the review is complete.</p>
        <p>– The CoinX Team</p>
      `;
            text = `Your ${transactionType} request of ${formattedAmount} is on hold. Remarks: ${remarks || "No remarks"}.`;
            break;

        default:
            subject = `Update on your transaction`;
            html = `
        <h2>Transaction Update</h2>
        <p>Dear user,</p>
        <p>Your transaction of ${formattedAmount} has been updated. Please check your account for details.</p>
        <p>– The CoinX Team</p>
      `;
            text = `Your transaction of ${formattedAmount} has been updated.`;
    }

    return { subject, html, text };
};

module.exports = { getTransactionActionEmailContent };
