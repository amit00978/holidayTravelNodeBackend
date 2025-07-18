const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email')
const  crypto = require('crypto')


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}


const createSendToken = (user, statusCode, res, message) =>{
    const token = signToken(user._id);
    const cookiesOption = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
        httOnly:true
    } 
    if(process.env.NODE_ENV=='production') cookiesOption.secure = true;
    res.cookie('jwt',token,cookiesOption)
    res.status(statusCode).json({
        status: 'success',
        message: message? message: 'User created successfully',
        data: {
            token
        }
    });
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
    newUser.password = undefined;
    newUser.passwordChangedAt = undefined;
    newUser.active = undefined;

    createSendToken(newUser,201,res);   

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

    createSendToken(user,200,res);   
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


 exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(404, 'No user found with that email'));
    }

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested a password reset.
    Please make a PUT request to: ${resetURL} with your new password in the request body.
    If you did not make this request, please ignore this email and your password will remain unchanged.`;

    try{
        await sendEmail({
            email:req.body.email ,
            subject:"Reset Password",
            message:message
        })
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError(500,'There is an error sending the email. Try again later!'))
    }


    res.status(200).json({
        status: 'success',
        message
    });
    // sendEmail(user.email, 'Password reset', message);
    // console.log(message);
});


exports.resetPassword = catchAsync(async (req, res, next) => {  


    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: resetToken, passwordResetExpire : { $gt: Date.now() } });

    console.log("=====user",user)
    if (!user) {
        return next(new AppError(400, 'Invalid token or token has expired'));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password reset successful. You can now log in.'
    });
});


exports.updatePassword = catchAsync(async (req, res, next) => {

    const currentPassword = req.body.currentPassword
    const user = req.user
    const freshUser = await User.findOne({ email: user.email }).select('+password');
    if (!(await freshUser.comparePassowrd(currentPassword,freshUser.password))) {
        return next(new AppError(401, 'Incorrect Current password password'));
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.confirmNewPasswordConfirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Password Change successful. You can now log in.'
    });

})


const htmlOTP = (otp)=> `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #4CAF50;">Your OTP Code</h2>
    <p>Hello,</p>
    <p>Use the following One-Time Password (OTP) to complete your authentication. This OTP is valid for <strong>5 minutes</strong>.</p>
    <div style="font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center; letter-spacing: 5px;">
      ${otp}
    </div>
    <p>If you did not request this, please ignore this email.</p>
    <hr style="margin: 20px 0;">
    <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} HolidaynTravel. All rights reserved.</p>
  </div>
`


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    const otpStore = {};
    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }

    const otp = generateOtp();
    otpStore[email] = otp;

    console.log(`Generated OTP for ${email}: ${otp}`);

     const updatedUser = await User.findOneAndUpdate(
    { email: email },
    { otp: otp },
    { new: true } // return the updated doc


  );
    await sendEmail({
        email:email ,
        subject:"Your OTP Code",
        message:htmlOTP(otp)
        })

    return res.json({ message: "OTP sent successfully",status: 'success'});

};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "email and otp are required" });
  }

  try {
    // find user by ID and otp
    const user = await User.findOne({ email: email, otp: otp });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OPTIONAL: clear OTP field after verification
    user.otp = undefined; // or null
    await user.save({ validateBeforeSave: false });
    createSendToken(user, 200, res, "OTP verified successfully");   

    // return res.json({ status: 'success', message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserMe = async (req,res)=>{

const user = await User.findById(req.user.id).select('-role -createdAt -passwordChangedAt -updatedAt -_id -password');

    res.status(200).json({
        status: 'success',
        user: user
    });

}

