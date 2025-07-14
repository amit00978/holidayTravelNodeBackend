const express = require('express')
const router = express.Router();
// const packageController = require('../controllers/packageController')
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController')


// router.route('/package-stats').get(packageController.getPackageStats);
// router.route('/monthly-plan/:year').get(packageController.getMonthlyPlan);

router
    .route('/')
    .post(orderController.createOrder);

``
module.exports = router