const express = require('express');
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')
const reviewRouter = express.Router({
    mergeParams: true
});

reviewRouter.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect,
        authController.restrictTo('user', 'admin'),
        reviewController.setReviewData, reviewController.createReview);

reviewRouter.route('/:id')
    .get(reviewController.getReview)
    .delete(authController.protect, reviewController.deleteReview)
    .patch(authController.protect, reviewController.updateReview);

module.exports = reviewRouter;