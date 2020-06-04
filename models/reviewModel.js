const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('./../utils/appError');
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

// reviewSchema.pre('save', function (next) {
//     const rev = this.constructor.findOne({
//         tour: this.tour,
//         user: this.user
//     })
//     console.log(rev);
//     if (rev != null) {
//         return next((new AppError('This user has already reviewed this tour, if you wish to change, kindly go to update'), 500));
//     }
//     next();
// });
reviewSchema.index({
    tour: 1,
    user: 1
}, {
    unique: true
})
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email -_id',
    });
    next();
})

reviewSchema.statics.calculateAverageRatings = async function (tourID) {
    const stats = await this.aggregate([{
            $match: {
                tour: tourID
            }
        }, //match closing
        {
            $group: {
                _id: '$tour',
                nRatings: {
                    $sum: 1
                },
                avgRating: {
                    $avg: '$rating'
                },
            }
        }, //group closing
    ]);
    console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourID, {
            ratingsAverage: stats[0].avgRating,
            ratingQuantity: stats[0].nRatings
        });
    } else {
        await Tour.findByIdAndUpdate(tourID, {
            ratingsAverage: 4.5,
            ratingQuantity: 0
        });
    }
}

reviewSchema.post('save', function () {
    //this.contructor points to the instance of Review Model
    this.constructor.calculateAverageRatings(this.tour);
})
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    console.log(this.r);
    next();
})
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calculateAverageRatings(this.r.tour);
})
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;