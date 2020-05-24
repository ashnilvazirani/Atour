const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeature = require('./../utils/apiFeatures');
exports.getTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.fields = 'name,duration,price,summary, ';
  request.query.sort = 'price,averageRatings';
  next();
}

exports.getAllTours = async (request, response) => {
  console.log(request.query);
  try {
    const features = new APIFeature(Tour.find(), request.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    response.status(200).json({
      status: 'sucess',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'failed-to-fetch-tours',
      message: error.message,
    });
  }
};
exports.getTour = async (request, response) => {
  const tour = await Tour.findById(request.params.id);
  try {
    if (tour == null) {
      return response.status(404).json({
        status: 'da-not-found',
        message: 'invalid-ID',
      });
    }
    response.status(200).json({
      status: 'sucess-fetch-with-id',
      doneAt: request.myTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'failed-to-fetch-tours',
      message: error.message,
    });
  }
};

exports.createTour = async (request, response) => {
  // const newTour = new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(request.body);
    response.status(200).json({
      status: 'success-insertion-tour',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'failed-to-store-tour',
      message: error.message,
    });
  }
};

exports.updateTour = async (request, response) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      request.params.id,
      request.body, {
        new: true,
        runValidators: true,
      }
    );
    response.status(200).json({
      status: 'success-insertion-tour',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'failed-to-store-tour',
      message: error.message,
    });
  }
};
exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);
    response.status(200).json({
      status: 'success-delete',
      data: null,
    });
  } catch (error) {
    response.status(400).json({
      status: 'failed-delete',
      message: error.message,
    });
  }
};

exports.getTourStats = async (request, response) => {
  try {
    const stats = await Tour.aggregate([{
        $match: {
          ratingsAverage: {
            $gte: 4.5
          } //gte closing
        } //match closing
      }, //match object closing
      {
        $group: {
          _id: null,
          minPrice: {
            $min: '$price'
          },
          maxPrice: {
            $max: '$price'
          },
          avgPrice: {
            $avg: '$price'
          },
        } //group closing
      } //group object closing
    ]); //stats closing
    response.status(200).json({
      status: 'success-stats',
      data: {
        stats
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}