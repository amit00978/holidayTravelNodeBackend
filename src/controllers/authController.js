const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
exports.signup= catchAsync(async (req, res, next) => {

    const {
        name='',
        email='',
        phone='',
        password='',
        passwordConfirm='',
        passwordChangedAt='',
        role=''
      } = req.body;

    const newUser = await User.create({
        name: name,
        email: email,
        phone: phone,
        password: password,
        passwordConfirm: passwordConfirm,
        passwordChangedAt : passwordChangedAt,
        role: role
    });
    

    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user : newUser,
            token
        }
    });
});

exports.login = catchAsync(async (req, res,next) => { 

    const { email, password } = req.body;
    if (!email ||!password) {
       return next(new AppError(400, 'Please provide email and password'));
    }

    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user ||!(await user.comparePassowrd(password,user.password))) {
        return next(new AppError(401, 'Incorrect email or password'));
    }
    const token= signToken(user._id);
    res.status(200).json({
        status:'success',
        token
    });

 });

 exports.protect = catchAsync(async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];   
    }
    if(!token){
        return next(new AppError(401,"You are not logged in!. Please log in to get access"))
    }
   const decoded =  await  promisify(jwt.verify)(token,process.env.JWT_SECRET);
   const freshUser = await User.findById(decoded.id);
   if(!freshUser){
    return next(new AppError(401,'The user belonging to this token does no longer exist.'))
   }
   if(freshUser.changesPasswordAfter(decoded.iat)){
    return next(new AppError(401,'User recently changed password! Please log in again.'))
   }
   req.user = freshUser;
    next();
 })

 exports.restrictTo = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
 }