const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

app.use(express.json()); //middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

// app.use((request, response, next) => {
//   console.log('MY MIDDLEWARE IS MY MIDDLEWARE, NODE OF YOUR MIDDLEWARE');
//   next();
// });
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//Developer created middleware
app.use((request, response, next) => {
  request.myTime = new Date().toISOString();
  next();
});

app.get(`/`, (request, response) => {
  response.status(200).json({
    message: 'HELLO FROM SERVER SIDE!!',
    app: 'Atours',
  });
});
app.post('/', (request, response) => {
  console.log(request.body);
});

module.exports = app;
