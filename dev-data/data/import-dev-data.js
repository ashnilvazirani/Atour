// const app = require('./app');
const mongoose = require('mongoose');
const fs = require('fs')
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const Availability = require('./../../models/tourAvailability');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
//////////////////////////////////////////////////////////////////////
// CONNECTION TO A LOCAL DB:
mongoose.connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(conn => {
    console.log('CONNECTION DONE')
})
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

console.log(tours)
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, {
            validateBeforeSave: false
        });
        await Review.create(reviews);

        console.log('DATA IMPORTED');
        process.exit();
    } catch (error) {
        console.log(error.message)
    }
}
const deleteData = async () => {
    try {
        await Review.deleteMany();
        await User.deleteMany();
        await Availability.deleteMany();
        await Tour.deleteMany();

        console.log('DATA DELETED');
        process.exit();
    } catch (error) {
        console.log(error.message)
    }
}
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}