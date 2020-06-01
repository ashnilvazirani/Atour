const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Please enter some review message'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must be specific to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must be written by a user']
    }
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});

// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name email -_id',
//     }).populate({
//         path: 'tour',
//         select: 'name'
//     });
//     next();
// })
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email -_id',
    });
    next();
})
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;