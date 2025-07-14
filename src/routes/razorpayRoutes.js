const express = require('express')
const router = express.Router();
const razorpayController = require('../controllers/razorpayController')




router
    .route('/')
    .post(razorpayController.razorPayOrder)

module.exports = router

