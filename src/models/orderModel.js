const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  orderId:{
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zip: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  country: {
    type: String,
    trim: true
  }
}, {
  timestamps: true  // adds createdAt and updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
