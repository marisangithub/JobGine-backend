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

  await transporter.sendMail({

    from: "marisan.cleverso@gmail.com",

    to: email,

    subject:
      "Jobgine Email Verification",

    html: `
      <div style="font-family:Arial">
        <h2>Jobgine</h2>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>This OTP expires in 10 minutes.</p>
      </div>
    `
  });

};

module.exports = {
  sendOTP
};
