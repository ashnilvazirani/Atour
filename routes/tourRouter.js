const express = require('express');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRouter')
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);
// tourRouter.checkData;
tourRouter.route('/top-5-tours').get(tourController.getTopTours, tourController.getAllTours);

tourRouter.route('/monthly-plan/:year')
    .get(authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan);

tourRouter.route('/tour-stats').get(tourController.getTourStats)

tourRouter.route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages, tourController.resizeTourImage, tourController.updateTour)

    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

tourRouter.route('/toursWithin/:distance/center/:latlon/unit/:unit')
    .get(tourController.getToursWithin);

tourRouter.route('/distances/:latlon/unit/:unit')
    .get(tourController.getDistances);

// tourRouter.route('/:tourID/review').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
tourRouter.use('/:tourID/review', reviewRouter);
module.exports = tourRouter;