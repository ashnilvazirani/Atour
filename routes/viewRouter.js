const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewsController')

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview)
router.get('/overview', viewController.getOverview);
router.get('/tour/:name', authController.protect, viewController.getTour)
router.get('/login', viewController.getLogin)
module.exports = router;