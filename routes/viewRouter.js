const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewsController')
const bookingController = require('./../controllers/bookingController')


router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview);
router.get('/overview', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:name', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);
router.get('/post-review', authController.protect, viewController.userReviews);

module.exports = router;