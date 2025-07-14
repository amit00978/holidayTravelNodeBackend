
const fs = require('fs');
const path = require('path');
const Order = require('../models/orderModel');
const APIFeatures = require('../utils/APIFeatures');
const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.createOrder = catchAsync(async (req, res, next) => {

    const orders = await Order.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            orders
        }
    });
})



