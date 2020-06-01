const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp')
const AppError = require('./utils/appError');
const app = express();

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const revireRouter = require('./routes/reviewRouter');

app.use(helmet());
//middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many unwanter requests'
});
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
  whitelist: ['duration', 'ratingQuantity', 'ratingsAverage', 'difficulty']
}));
app.use('/api', limiter);
app.use(express.json({
  limit: '100kb'
}));
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
app.use('/api/v1/reviews', revireRouter);

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
app.all('*', (request, response, next) => {
  // response.status(404).json({
  //   status: 'Failer to get the url',
  //   message: `Cant fetch the ${request.originalUrl} on this server`
  // })
  // next();
  // const err = new Error(`Cant fetch the ${request.originalUrl} on this server`);
  // err.status = 'fail-to-requeted-url';
  // err.statusCode = 404;
  // next(err);
  next(
    new AppError(`Cant fetch the ${request.originalUrl} on this server`, 404)
  );
});
app.use((error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});
module.exports = app;