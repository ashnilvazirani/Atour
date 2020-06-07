const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

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
    response.status(200).render('tour', {
        title: tour.name,
        tour
    });
    next();
});

exports.getLogin = catchAsync((request, response, next) => {
    response.render('login', {
        title: 'Log in to Atours'
    });
    next();
});