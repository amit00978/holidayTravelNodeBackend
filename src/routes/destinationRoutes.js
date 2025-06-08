const express = require('express')
const router = express.Router();
const destinationController = require('../controllers/destinationController')

router
.route('/:slug')
.get(destinationController.getDestinationBySlug)

module.exports = router