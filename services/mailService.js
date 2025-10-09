const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in", // or "smtp.zoho.com" if you're using Zoho US servers
    port: 587,            // SSL port
    secure: false,         // use SSL
    auth: {
        user: process.env.ZOHO_USER, // your Zoho email
        pass: process.env.ZOHO_PASS  // app password, not normal password
    }
});
/**
 * Send admin notification when new member is created
 * @param {Object} member - Newly created member object
 */
const sendMail = async ({ to, subject, html, text, from }) => {
    try {
        const mailOptions = {
            from: from || `"The CoinX Team" <${process.env.ZOHO_USER}>`,
            to,
            subject,
            html,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};


module.exports = { sendMail };
