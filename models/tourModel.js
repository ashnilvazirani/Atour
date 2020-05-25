const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A valid tour name is must'],
        unique: true,
        trim: true,
        minlength: [10, 'A tour name must be atleast 10 characters long'],
        maxlength: [40, 'A tour name must be at most 40 characters long'],
    },
    slug: String,
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
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'A tour must have either of three',
        },
    },
    price: {
        type: Number,
        required: true,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'At least 1.0 rating'],
        max: [5, 'Max rate value =5.0'],
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price;
            },
            message: 'The discounted price should be less than the regular price'
        }
    },
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
        select: false, //doesn't send the value
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
//Using the regular function instead of arrow function since we need access to 'this' keyword to point to current object
//this pre function is executed on SAVE event on methods save() and create() and not on insertMany()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});
tourSchema.pre(/^find/, function (next) {
    this.find({
        secretTour: {
            $ne: true
        }
    });
    this.start = Date.now();
    next();
});
tourSchema.post(/^find/, function (doc, next) {
    console.log(`Query took ${Date.now() - this.start} ms`);
    next();
});
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
//AGGREGATE MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
    //excluding the all secret tours to perform aggregate function
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: true
            }
        }
    });
    console.log(this.pipeline());
    next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;