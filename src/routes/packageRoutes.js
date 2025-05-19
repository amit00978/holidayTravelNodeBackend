const express = require('express')
const router = express.Router();
const fs = require('fs');
const packageController = require('../controllers/packageController')
const authController = require('../controllers/authController');


router.route('/package-stats').get(packageController.getPackageStats);
router.route('/monthly-plan/:year').get(packageController.getMonthlyPlan);

router
    .route('/')
    .get(packageController.getAllPackages)
    .post(authController.protect,authController.restrictTo('admin'), packageController.createPackage);
router
    .route('/:id')
    .get(packageController.getPackage)
    .patch(authController.protect,authController.restrictTo('admin'),packageController.updatePackage)
    .delete(authController.protect,authController.restrictTo('admin'),packageController.deletePackage);
module.exports = router