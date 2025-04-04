const express = require('express')
const router = express.Router();
const fs = require('fs');
const packageController = require('../controllers/packageController')
const authController = require('../controllers/authController');


router.route('/package-stats').get(packageController.getPackageStats);
router.route('/monthly-plan/:year').get(packageController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect,packageController.getAllPackages)
    .post( packageController.createPackage);
router
    .route('/:id')
    .get(packageController.getPackage)
    .patch(packageController.updatePackage)
    .delete(authController.protect,packageController.deletePackage);
    // authController.restrictTo('admin')

module.exports = router