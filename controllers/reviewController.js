const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./generalHandler');

exports.getAllReviews = factory.getAll(Review);

exports.setReviewData = (request, response, next) => {
    // const newTour = new Tour({});
    // newTour.save();
    if (!request.body.tour) request.body.tour = request.params.tourID;
    if (!request.body.user) request.body.user = request.user.id;
    next();
};

exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);