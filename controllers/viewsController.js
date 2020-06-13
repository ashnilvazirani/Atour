const Tour = require('./../models/tourModel');
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {
    bookTour
} = require('../public/js/stripe');
const Booking = require('../models/bookingModel');
const {
    request,
    response
} = require('express');

exports.getOverview = catchAsync(async (request, response, next) => {
    const tours = await Tour.find();
    response.status(200).render('overview', {
        title: 'All tours',
        tours
    });
    next();
});

exports.getAll = (request, response, next) => {
    response.status(200).render('base', {
        tour: 'New test tour',
        developer: 'Ashnil Vazirani',
        title: 'Exciting tours for adventurous people'
    });
    next();
}

exports.getTour = catchAsync(async (request, response, next) => {
    const tour = await Tour.findOne({
        slug: request.params.name
    }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (!tour) {
        return response.status(404).render('error', {
            title: 'Something went wrong!',
            msg: 'Page not found'
        })
    } else {
        return response.status(200).render('tour', {
            title: tour.name,
            tour
        });
    }

    next();
});

exports.getLogin = catchAsync((request, response, next) => {
    response.render('login', {
        title: 'Log in to Atours'
    });
    // next();
});
exports.getAccount = catchAsync((request, response, next) => {
    response.render('account', {
        title: 'Your Account'
        // user: request.locals.user
    });
    // next();
})
exports.updateUserData = catchAsync(async (request, response) => {
    console.log(request.body)
    try {
        const user = await User.findByIdAndUpdate(request.user.id, {
            email: request.body.email,
            name: request.body.name,
        }, {
            new: true,
            runValidators: true
        });

        return response.render('account', {
            title: 'Your Account',
            user
        });

    } catch (error) {
        return response.status(404).render('error', {
            title: 'Something went wrong!',
            msg: 'Incorrect data'
        })

    }

});
getUserTours = async (request) => {
    //based on the current logged in user
    const bookings = await Booking.find({
        user: request.user.id
    });
    const tourIDs = bookings.map(el => el.tour._id);
    const tours = await Tour.find({
        _id: {
            $in: tourIDs
        }
    });
    return tours;
}
exports.getMyTours = async (request, response, next) => {
    const tours = await getUserTours(request);
    response.status(200).render('overview', {
        title: 'My tours',
        tours
    })
}

exports.userReviews = async (request, response, next) => {
    //getting all the tours ever done by user
    var tours = await getUserTours(request);
    const tourID = tours.map(el => el._id);
    //getting the reviews posted by user for the tours completed
    var review = await Review.find({
        user: request.user._id,
        tour: {
            $in: tourID
        }
    })
    const reviewedTours = review.map(el => el.tour);
    //filtering the tours with pending reviews
    reviewedTours.map(el => {
        tourID.splice(reviewedTours.indexOf(el), 1);
    });
    tours = await Tour.find({
        _id: {
            $in: tourID
        }
    });
    response.status(200).render('reviews', {
        title: 'post my review',
        tours
    });
}

exports.getSignUp = (request, response, next) => {
    response.status(200).render('signup', {
        title: 'Welcome to Atours!'
    });
}