const express = require('express');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRouter')
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);
// tourRouter.checkData;
tourRouter.route('/top-5-tours').get(tourController.getTopTours, tourController.getAllTours);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter.route('/tour-stats').get(tourController.getTourStats)
tourRouter.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// tourRouter.route('/:tourID/review').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
tourRouter.use('/:tourID/review', reviewRouter);
module.exports = tourRouter;