const mongoose = require('mongoose');

const inquiryForm = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number.']
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('InquiryForm', inquiryForm);

module.exports = Inquiry;
