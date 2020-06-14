const stripe = require('stripe')(process.env.STRIPE_SECRETKEY)
const Tour = require('./../models/tourModel');
const TourAvailability = require('./../models/tourAvailability');
const Booking = require('./../models/bookingModel');
const {
    response
} = require('express');
const factory = require('./generalHandler');
const catchAsync = require('../utils/catchAsync');
const {
    findByIdAndUpdate
} = require('./../models/tourAvailability');
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
var dataForBooking = {};
//logic to check if the booking can be made or not
exports.checkTourAvailable = async (request, response, next) => {
    try {
        const tour = await TourAvailability.findOne({
            tour: request.body.tourID,
            tourStartDate: request.body.dates
        })
        if (tour.tourStartDate > new Date(Date.now()) && (tour.tourGroupSize - tour.tourBookedSeats) > request.body.members) {
            dataForBooking = request.body;
            return response.status(200).json({
                status: "success"
            })
        }
        return response.status(200).json({
            status: "fail"
        })

    } catch (error) {
        console.log(error);
    }
}
exports.createBookingCheckout = catchAsync(async (request, response, next) => {
    const {
        tour,
        user,
        price
    } = request.query;
    if (!user && !tour && !price) return next();

    await Booking.create({
        tour,
        user,
        price
    });
    const available = await TourAvailability.findOne({
        tour: dataForBooking.tourID,
        tourStartDate: dataForBooking.dates
    });
    const members = available.tourBookedSeats + (dataForBooking.members * 1);
    const updateData = {
        tourBookedSeats: members
    }
    const t = await TourAvailability.findByIdAndUpdate(available._id, updateData, {
        new: true,
        runValidators: true,
    });
    response.redirect(request.originalUrl.split('?')[0]);
    next();
});


exports.getAllBookings = factory.getAll(Booking)
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);