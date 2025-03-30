const express = require('express')
const router = express.Router();
const fs = require('fs');
const packageController = require('../controller/packageController')


router.route('/package-stats').get(packageController.getPackageStats);
router.route('/monthly-plan/:year').get(packageController.getMonthlyPlan);

router
    .route('/')
    .get(packageController.getAllPackages)
    .post( packageController.createPackage);
router
    .route('/:id')
    .get(packageController.getPackage)
    .patch(packageController.updatePackage)
    .delete(packageController.deletePackage);

module.exports = router