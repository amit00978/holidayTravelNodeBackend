
const User = require('../models/userModal');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
exports.getAllUser = catchAsync(async (req,res) => {
    const features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
    const allUser = await features.query;
    res.status(200).json({
        status: 200,
        data: allUser
    })
});

exports.createUser =(req,res) => {
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}
exports.getUser =(req,res) => {
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}
exports.updateUser =(req,res) => {
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

exports.deleteUser  =(req,res) => {
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}
