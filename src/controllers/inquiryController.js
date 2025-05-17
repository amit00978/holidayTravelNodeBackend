



const Inquiry = require('../models/inquiryFormModal')
const catchAsync = require('../utils/catchAsync');
const email = require('../utils/email');

exports.submitInquiry = catchAsync(async (req, res, next) => {
    const { name, emailAddress, phoneNumber,  message} =req.body
    const newIquiry =  await Inquiry.create({name,emailAddress,phoneNumber,message})
    email({  email: 'hello@holidaytravel.in',
        subject: 'Inquiry  ' + phoneNumber,
        message: message})
    res.status(201).json({
        status: 'success',
        data: {
            newIquiry 
        }
    });
})

