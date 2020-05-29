const Tour = require('./../models/tourModel');
const APIFeature = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.fields = 'name,duration,price,summary, ';
  request.query.sort = 'price,averageRatings';
  next();
};

exports.getAllTours = catchAsync(async (request, response, next) => {

  console.log(request.query);
  const features = new APIFeature(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  response.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      tours,
    },
  });
  next();

});
exports.getTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findById(request.params.id);

  if (tour == null) {
    return next(new AppError('No tour found with this ID', 404))
  }
  response.status(200).json({
    status: 'sucess-fetch-with-id',
    doneAt: request.myTime,
    data: {
      tour,
    },
  });

});

exports.createTour = catchAsync(async (request, response, next) => {
  // const newTour = new Tour({});
  // newTour.save();
  const newTour = await Tour.create(request.body);
  response.status(200).json({
    status: 'success-insertion-tour',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (request, response, next) => {

  const updatedTour = await Tour.findByIdAndUpdate(
    request.params.id,
    request.body, {
      new: true,
      runValidators: true,
    }
  );

  if (updatedTour == null) {
    return next(new AppError('No tour found with this ID', 404))
  }
  response.status(200).json({
    status: 'success-insertion-tour',
    data: {
      tour: updatedTour,
    },
  });

});

exports.deleteTour = catchAsync(async (request, response, next) => {

  const deletedTour = await Tour.findByIdAndDelete(request.params.id);
  response.status(200).json({
    status: 'success-delete',
    data: null,
  });
  if (deletedTour == null) {
    return next(new AppError('No tour found with this ID', 404))
  }
});
exports.getTourStats = catchAsync(async (request, response, next) => {

  const stats = await Tour.aggregate([{
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        }, //gte closing
      }, //match closing
    }, //match object closing
    {
      $group: {
        _id: {
          $toUpper: '$difficulty',
        },
        num: {
          $sum: 1,
        },
        numRatings: {
          $sum: '$averageRatings',
        },
        minPrice: {
          $min: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
        avgPrice: {
          $avg: '$price',
        },
      }, //group closing
    }, //group object closing
    {
      $sort: {
        minPrice: -1, //descening && minPrice: 1-->ascending
      }, //sort closing
    }, //sort upper closing
    {
      $match: {
        _id: {
          $ne: 'EASY',
        },
      },
    },
  ]); //stats closing
  response.status(200).json({
    status: 'success-stats',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (request, response, next) => {

  const year = request.params.year * 1;
  const plan = await Tour.aggregate([{
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        num: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0, //setting the diaply to false
      },
    },
    {
      $limit: 12,
    },
  ]);

  response.status(200).json({
    status: 'success-stats',
    length: plan.length,
    data: {
      plan,
    },
  });
});