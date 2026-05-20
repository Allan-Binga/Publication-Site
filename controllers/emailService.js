const SibApiV3Sdk = require("sib-api-v3-sdk")

const defaultClient = SibApiV3Sdk.ApiClient.instance;

//Brevo API key authorization
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

//API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//Password Reset Email
const passwordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/password/change?token=${token}`
    // console.log(resetUrl)
    const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail()

    //Set Properties
    sendSMTPEmail.sender = {
        name: "Publication Site",
        email: "noreply@prestigegirlshostel.co.ke"
    }
    sendSMTPEmail.to = [{ email }]
    sendSMTPEmail.subject = "Password reset request"
    sendSMTPEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #555;">Click the button below to reset your password.</p>
          <a href="${resetUrl}" 
            style="display: inline-block; padding: 10px 20px; margin-top: 15px; background-color: #ff9800; color: #fff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #777;">If you did not request this, ignore this email.</p>
        </div>
      </div>`;

    try {
        const response = await apiInstance.sendTransacEmail(sendSMTPEmail)
        // console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error("Brevo API Error:", error.response?.text || error.message);
        console.log(error)
        throw error;
    }
}

module.exports = { passwordResetEmail }