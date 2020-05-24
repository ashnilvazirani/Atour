const express = require('express');
const tourController = require('./../controllers/tourController')

const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);
// tourRouter.checkData;
tourRouter.route('/top-5-tours').get(tourController.getTopTours, tourController.getAllTours);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter.route('/tour-stats').get(tourController.getTourStats)
tourRouter.route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = tourRouter;