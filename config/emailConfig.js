const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  // secure: process.env.SMTP_SECURE
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ [ERROR] Email Server Connection Failed....................",error);
  } else {
    console.log('✅ [INFO] Email service is online and ready....................');
  }
});


const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("✅ [INFO] Email sent successfully!.............................");
  } catch (error) {
    console.error("❌ [ERROR] Error sending email...............................", error);
  }
};

module.exports = sendEmail;
