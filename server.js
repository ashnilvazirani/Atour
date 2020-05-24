const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env'
});
const app = require('./app');
//////////////////////////////////////////////////////////////////////
// CONNECTION TO A LOCAL DB:
mongoose.connect(process.env.DB_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(conn => {
  console.log(conn.connection);
  console.log('CONNECTION DONE')
})
//////////////////////////////////////////////////////////////////////

// mongoose.connect(process.env.DATABASE, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// }).then(conn => {
//   console.log(conn.connection);
//   console.log('CONNECTION DONE')
// })


// const testTour = new Tour({
//   name: 'Paris',
//   rating: 10,
//   price: 1000
// });
// testTour.save().then(document => {
//   console.log(document);
// }).catch(err => {
//   console.log(err.message)
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LISTENING TO PORT ${port}`);
});