// const app = require('./app');
const mongoose = require('mongoose');
const fs = require('fs')
const Tour = require('./../../models/tourModel');
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
console.log(tours)
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('DATA IMPORTED');
        process.exit();
    } catch (error) {
        console.log(error.message)
    }
}
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('DATA DELETED');
    } catch (error) {
        console.log(error.message)
    }
}
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}