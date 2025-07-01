const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Set up Zoho SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",        // or smtp.zoho.com for global users
    port: 465,                   // secure port
    secure: true,                // use SSL
    auth: {
      user: process.env.ZOHO_USER,  // your zoho email e.g., support@yourdomain.com
      pass: process.env.ZOHO_PASS   // app-specific password (if 2FA is enabled)
    }
  });
  
    transporter.verify(function(error, success) {
    if (error) {
      console.error("🚨 SMTP CONFIGURATION ERROR:", error);
    } else {
      console.log("✅ Server is ready to take our messages:", success);
    }
  });

  const mailOptions = {
    from: `"Holiday Travel" <${process.env.ZOHO_USER}>`, // sender
    to: options.email,                                   // recipient
    subject: options.subject,
    text: options.message,
    html: `<p>${options.message}</p>`                    // optional HTML
  };

  await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;
