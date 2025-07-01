



const Inquiry = require('../models/inquiryFormModal')
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

exports.submitInquiry = catchAsync(async (req, res, next) => {
    const { name, emailAddress, phoneNumber, message } = req.body
    const newIquiry = await Inquiry.create({ name, emailAddress, phoneNumber, message })
    try {
        await sendEmail({
            email: 'amit00978@gmail.com',
            subject: 'Inquiry  ' + phoneNumber + " Email "+ emailAddress,
            message: message
        })
        res.status(201).json({
            status: 'success',
            data: {
                newIquiry 
            }
        });
    }
    catch (error) {
        console.log("=========error", error)
        res.status(500).json({
            status: 'error',
            err: error
        });
    }


})

