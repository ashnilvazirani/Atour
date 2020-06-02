const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./generalHandler');

exports.getAllReviews = catchAsync(async (request, response) => {
    let filter = {};
    if (request.params.tourID) filter = {
        tour: request.params.tourID
    }
    const reviews = await Review.find(filter);
    response.status(200).json({
        status: 'sucess',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

exports.setReviewData = catchAsync(async (request, response, next) => {
    // const newTour = new Tour({});
    // newTour.save();
    if (!request.body.tour) request.body.tour = request.params.tourID;
    if (!request.body.user) request.body.user = request.user.id;
    next();
});

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);