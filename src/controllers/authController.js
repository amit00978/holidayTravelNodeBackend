const jwt = require('jsonwebtoken');
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
exports.signup= catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
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