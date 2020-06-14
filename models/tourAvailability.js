const mongoose = require('mongoose');

const TourAvailabilitySchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
    },
    tourStartDate: {
        type: Date,
        required: [true, 'Any tour must have a single start date!']
    },
    tourPrice: {
        type: Number,
        require: [true, 'Booking must have a price.']
    },
    tourGroupSize: {
        type: Number,
        default: 0
    },
    tourBookedSeats: {
        type: Number,
        default: 0
    }
});

// TourAvailabilitySchema.pre(/^find/, function (next) {
//     this.populate('tour').populate({
//         select: 'name'
//     });
//     next();
// });

const TourAvailability = mongoose.model('TourAvailability', TourAvailabilitySchema);

module.exports = TourAvailability;