const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

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

exports.createReview = catchAsync(async (request, response, next) => {
    // const newTour = new Tour({});
    // newTour.save();
    if (!request.body.tour) request.body.tour = request.params.tourID;
    if (!request.body.user) request.body.user = request.user.id;
    const newReview = await Review.create(request.body);
    response.status(200).json({
        status: 'success-submission-of-tour',
        data: {
            review: newReview,
        },
    });
});