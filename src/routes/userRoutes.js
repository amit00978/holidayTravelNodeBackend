const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController');
const AppError = require('../utils/AppError');
const fs = require('fs');


router.post('/otp',authController.sendOtp)
router.post('/verifyOtp',authController.verifyOtp)
router.post('/signup',authController.protect,authController.restrictTo('admin'), authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword',authController.protect,authController.restrictTo('admin'),authController.forgotPassword);
router.post('/changePassword', authController.protect,authController.restrictTo('admin'),authController.protect,authController.updatePassword);
router.put('/resetPassword/:token',authController.protect,authController.restrictTo('admin'), authController.resetPassword);
router.patch('/updateMe',authController.protect,authController.restrictTo('admin'),authController.protect,userController.updateMe)
router.delete('/deleteMe',authController.protect,authController.restrictTo('admin'),authController.protect,userController.deleteMe)


router.route('/')
    .get(authController.protect,authController.restrictTo('admin'),userController.getAllUser)
    .post(authController.protect,authController.restrictTo('admin'),userController.createUser);
router.route('/:id')
    .get(authController.protect,authController.restrictTo('admin'),userController.getUser)
    .patch(authController.protect,authController.restrictTo('admin'),userController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'),userController.deleteUser);
    


 module.exports = router

