// utils/emailTemplates/newTransactionTemplate.js

const getNewTransactionEmailContent = ({ user, transaction }) => {
    const {
        amount,
        currencyType,
        transactionId,
        transactionType,
        withdrawAddress,
        createdAt,
    } = transaction;

    const formattedAmount = `${amount} ${currencyType?.toUpperCase()}`;
    const action = transactionType === "add" ? "Deposit" : "Withdrawal";

    const subject = `🔔 New ${action} Request from ${user.userName || "User"}`;

    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #1a73e8;">New ${action} Request</h2>
      <p>Hello Admin,</p>
      <p>A new <strong>${action.toLowerCase()}</strong> request has been created by a user.</p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>User Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.userName || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.email || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Transaction Type:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${transactionType}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formattedAmount}</td>
        </tr>
        ${transactionId
            ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Transaction ID:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${transactionId}</td>
        </tr>`
            : ""
        }
        ${withdrawAddress
            ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Withdrawal Address:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${withdrawAddress}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(createdAt).toLocaleString()}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">Please review and take necessary action in the admin panel.</p>

      <p style="color: #555; font-size: 14px; margin-top: 20px;">
        — The CoinX System
      </p>
    </div>
  `;

    const text = `
New ${action} Request
--------------------------
User: ${user.userName || "N/A"}
Email: ${user.email || "N/A"}
Transaction Type: ${transactionType}
Amount: ${formattedAmount}
${transactionId ? `Transaction ID: ${transactionId}` : ""}
${withdrawAddress ? `Withdrawal Address: ${withdrawAddress}` : ""}
Date: ${new Date(createdAt).toLocaleString()}

Please review in the admin panel.
  `;

    return { subject, html, text };
};

module.exports = { getNewTransactionEmailContent };
