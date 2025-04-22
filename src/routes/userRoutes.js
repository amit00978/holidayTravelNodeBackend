const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController');
const AppError = require('../utils/AppError');
const fs = require('fs');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/changePassword', authController.protect,authController.updatePassword);
router.put('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMe',authController.protect,userController.updateMe)

router.route('/')
    .get(userController.getAllUser)
    .post(userController.createUser);
router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'),userController.deleteUser);
    


 module.exports = router

