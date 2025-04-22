
const User = require('../models/userModal');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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
const filterObj = (obj,...allowedFields) => {
    newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.updateMe = catchAsync(async (req,res,next)=>{

    if(req.body.password ||req.body.passwordConfirm){
        return next(new AppError(500,"This route is not for password update"))
    }
    const filteredBody = filterObj(req.body,'name','email');
    const updateUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        user: updateUser
    });
})