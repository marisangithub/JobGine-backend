const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const sendOTP = async (
  email,
  otp
) => {
console.log("BREVO_USER:", process.env.BREVO_USER);
console.log("BREVO_PASS EXISTS:", !!process.env.BREVO_PASS);
console.log("FROM:", "marisan.cleverso@gmail.com");
  
const info = await transporter.sendMail({
  from: "marisan.cleverso@gmail.com",
  to: email,
  subject: "Jobgine Email Verification",
  html: `
    <div style="font-family:Arial">
      <h2>Jobgine</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    </div>
  `
});

console.log("EMAIL SENT:", info.messageId);
console.log("EMAIL SENT SUCCESS");

};

module.exports = {
  sendOTP
};
