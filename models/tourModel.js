const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A valid tour name is must'],
        unique: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: [true, 'Specify the number of days'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'How many maximum guests are allowed?'],
    },
    difficulty: {
        type: String,
        required: [
            true,
            'Let the tourists know about the difficulty level of this tour',
        ],
    },
    price: {
        type: Number,
        required: true,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'Enter some details for this tour'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'Some image is needed'],
        useUnifiedTopology: true,
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false //doesn't send the value
    },
    startDates: [Date],
});
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
//Using the regular function instead of arrow function since we need access to 'this' keyword to point to current object
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;