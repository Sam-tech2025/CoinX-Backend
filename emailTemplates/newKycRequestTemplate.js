// utils/emailTemplates/newKycRequestTemplate.js

/**
 * Generate email content for admin when a new KYC is submitted
 * @param {Object} params
 * @param {Object} params.user - The user who submitted KYC
 * @param {string} params.user.userName - Username of the user
 * @param {string} params.user.email - Email of the user
 * @param {string} params.country - User's country
 * @param {Object} params.documents - Uploaded document URLs
 * @param {string} params.kycId - The ID of the created KYC record
 */
const getNewKycRequestEmailContent = ({ user, country, documents = {}, kycId }) => {
    const submissionTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
    });

    const docLinks = [];

    if (documents.idFront)
        docLinks.push(`<li><strong>ID Front:</strong> <a href="${documents.idFront}" target="_blank">${documents.idFront}</a></li>`);

    if (documents.idBack)
        docLinks.push(`<li><strong>ID Back:</strong> <a href="${documents.idBack}" target="_blank">${documents.idBack}</a></li>`);

    if (documents.selfie)
        docLinks.push(`<li><strong>Selfie:</strong> <a href="${documents.selfie}" target="_blank">${documents.selfie}</a></li>`);


    const subject = `📄 New KYC Submission from ${user.userName || "a user"}`;

    const html = `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
            <div style="max-width:600px; background:#ffffff; border-radius:10px; padding:20px; margin:auto; border:1px solid #e5e7eb;">
                <h2 style="color:#111827;">New KYC Submission</h2>
                <p>Hello Admin,</p>
                <p>A new KYC request has been submitted on <strong>${submissionTime}</strong>.</p>
                
                <h3 style="margin-top:20px;">👤 User Details</h3>
                <ul style="line-height:1.6;">
                    <li><strong>Username:</strong> ${user.userName || "N/A"}</li>
                    <li><strong>Email:</strong> ${user.email || "N/A"}</li>
                    <li><strong>Country:</strong> ${country || "Not provided"}</li>
                </ul>

                <h3 style="margin-top:20px;">📎 Submitted Documents</h3>
                <ul style="line-height:1.6;">
                    ${docLinks.join("") || "<li>No documents found</li>"}
                </ul>

                <p style="margin-top:25px;">
                    You can review this submission in your <a href="https://coinx-admin-dashboard.com/kyc-approvals/${kycId}" style="color:#2563eb; text-decoration:none;">KYC Approvals Panel</a>.
                </p>

                <hr style="margin-top:30px; border:none; border-top:1px solid #e5e7eb;">
                <p style="color:#6b7280; font-size:14px;">This is an automated notification from <strong>CoinX Invest</strong>.</p>
            </div>
        </div>
    `;

    const text = `
New KYC Submission
-------------------------
User: ${user.userName || "N/A"}
Email: ${user.email || "N/A"}
Country: ${country || "N/A"}

Documents:
- ID Front: ${documents.idFront || "N/A"}
- ID Back: ${documents.idBack || "N/A"}
- Selfie: ${documents.selfie || "N/A"}
${Array.isArray(documents.additional) && documents.additional.length > 0
            ? documents.additional.map((doc, i) => `- Additional ${doc.name || `Document ${i + 1}`}: ${doc.url}`).join("\n")
            : ""
        }

Submitted: ${submissionTime}

Review here: https://coinx-admin-dashboard.com/kyc-approvals/${kycId}
    `;

    return { subject, html, text };
};

module.exports = { getNewKycRequestEmailContent };
