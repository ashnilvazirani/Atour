const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
        title: ' Exciting tours for adventurous people'
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