const stripe = require('stripe')(process.env.STRIPE_SECRETKEY)
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const {
    response
} = require('express');
const factory = require('./generalHandler');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('./../utils/appError');
// const catchAsync = require('./../utils/catchAsync');
// const factory = require('./generalHandler');
exports.getCheckoutSession = async (request, response, next) => {
    try {
        const tour = await Tour.findById(request.params.tourID);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${request.protocol}://${request.get('host')}?tour=${tour.id}&user=${request.user.id}&price=${tour.price}`,
            cancel_url: `${request.protocol}://${request.get('host')}`,
            customer_email: request.user.email,
            client_reference_id: request.params.tourID,
            line_items: [{
                name: `${tour.name} Tour`,
                description: `${tour.summary}`,
                // images: [`C:/Users/ashni/Desktop/NODE/Atour/public/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1,
            }]
        });

        response.status(200).json({
            status: 'success',
            session
        })
        next();
    } catch (error) {
        console.log(error);
    }
}
exports.createBookingCheckout = catchAsync(async (request, response, next) => {
    // const data = request.originalUrl.split('?')[1];
    // const tour = data.split('&')[0];
    // data = data.split('&')[1];
    // const user = data.split('&')[0];
    // data = data.split('&')[1];
    // const price = data.split('&')[0];
    const {
        tour,
        user,
        price
    } = request.query;
    console.log(tour, user, price);
    if (!user && !tour && !price) return next();

    await Booking.create({
        tour,
        user,
        price
    });
    // next();
    response.redirect(request.originalUrl.split('?')[0]);
});

exports.getAllBookings = factory.getAll(Booking)
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);