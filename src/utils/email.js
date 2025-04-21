const nodemailer = require('nodemailer')


const sendEmail =  async (options)=>{
// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6ad5aa3c4f80d0",
      pass: "4bc6f11b659cf4"
    }
  });

//   let mailOptions = {
//     from: '"Holiday Travel" <noreply@holidaytravel.com>', // sender address
//     to: 'someone@example.com', // ✅ recipient
//     subject: 'Test Email',
//     text: 'Hello! This is a test email from Holiday Travel.',
//     html: '<b>Hello! This is a test email from Holiday Travel.</b>'
//   };

    const mailOptions = {
        from: '"Holiday Travel" <noreply@holidaytravel.com>', 
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

  await  transporter.sendMail(mailOptions)
}

module.exports = sendEmail;