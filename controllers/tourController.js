const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./generalHandler');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please upload only a image file', 400), false);
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})
exports.uploadTourImages = upload.fields([{
    name: 'imageCover',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 3
  },
]);

exports.resizeTourImage = async (req, res, next) => {
  if (req.files.imageCover) {
    req.files.imageCover.map((file) => {
      const filename = `tour-cover-${req.params.id}-${Date.now()}.jpeg`;
      sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
        quality: 90
      }).toFile(`public/img/tours/${filename}`);
      req.body.imageCover = (filename);
    })
  }
  if (req.files.images) {
    req.body.images = [];
    req.files.images.map((file, i) => {
      const filename = `tour-image-${i+1}-${req.params.id}-${Date.now()}.jpeg`;
      sharp(req.files.images[i].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({
        quality: 90
      }).toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  }
  // console.log(req.files);
  // if (!req.files.images || !req.files.imageCover) {
  //   next();
  // }
  // if (!req.file) next();
  // req.file.filename = `user-${req.user.id}-${Date.now()}`
  // await sharp(req.file.buffer)
  //     .resize(500, 500)
  //     .toFormat('jpeg')
  //     .jpeg({
  //         quality: 90
  //     })
  //     .toFile(`public/img/users/${req.file.filename}`);
  next();
}

exports.getTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.fields = 'name,duration,price,summary, ';
  request.query.sort = 'price,averageRatings';
  next();
};

exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, {
  path: 'reviews'
});

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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

exports.getToursWithin = catchAsync(async (request, response, next) => {
  const {
    distance,
    latlon,
    unit
  } = request.params;
  const [latitude, longitude] = latlon.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!latitude || !longitude) {
    return next(new AppError('Please provide complete data'));
  }
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [
          [longitude, latitude], radius
        ]
      }
    }
  });
  response.status(200).json({
    status: 'sucess',
    result: tours.length,
    data: {
      tours
    }
  })
});

exports.getDistances = catchAsync(async (request, response, next) => {
  const {
    latlon,
    unit
  } = request.params;
  const [latitude, longitude] = latlon.split(',');

  if (!latitude || !longitude) {
    return next(new AppError('Please provide complete data'));
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.0001;
  const distances = await Tour.aggregate([{
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  response.status(200).json({
    status: 'sucess',
    result: distances.length,
    data: {
      distances
    }
  })
});