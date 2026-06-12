const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance =
  new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTP = async (email, otp) => {

  const result =
    await apiInstance.sendTransacEmail({

      sender: {
        email: "marisan.cleverso@gmail.com",
        name: "JobGine"
      },

      to: [
        {
          email: email
        }
      ],

      subject: "JobGine Email Verification",

      htmlContent: `
        <div style="font-family:Arial">
          <h2>JobGine</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `
    });

  console.log("EMAIL SENT:", result);
};

module.exports = {
  sendOTP
};