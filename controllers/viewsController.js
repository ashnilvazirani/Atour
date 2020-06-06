const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (request, response) => {
    const tours = await Tour.find();
    response.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getAll = (request, response) => {
    response.status(200).render('base', {
        tour: 'New test tour',
        developer: 'Ashnil Vazirani',
        title: ' Exciting tours for adventurous people'
    });
}

exports.getTour = catchAsync(async (request, response) => {
    const tour = await Tour.findOne({
        slug: request.params.name
    }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    console.log(tour);
    response.status(200).render('tour', {
        title: tour.name,
        tour
    });
});