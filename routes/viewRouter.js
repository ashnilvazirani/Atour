const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewsController')


router.get('/', authController.isLoggedIn, viewController.getOverview)
// router.get('/overview', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:name', authController.isLoggedIn, authController.protect, viewController.getTour)
router.get('/login', authController.isLoggedIn, viewController.getLogin)
router.get('/me', authController.protect, viewController.getAccount)
router.post('/submit-user-data', authController.protect, viewController.updateUserData)

module.exports = router;