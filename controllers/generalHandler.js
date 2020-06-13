const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeature = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (request, response, next) => {

    const doc = await Model.findByIdAndDelete(request.params.id);
    response.status(200).json({
        status: 'success-delete',
        data: null,
    });
    if (doc == null) {
        return next(new AppError('No document found with this ID', 404))
    }
});


exports.updateOne = Model => catchAsync(async (request, response, next) => {

    const doc = await Model.findByIdAndUpdate(
        request.params.id,
        request.body, {
            new: true,
            runValidators: true,
        }
    );

    if (doc == null) {
        return next(new AppError('No document found with this ID', 404))
    }
    response.status(200).json({
        status: 'success-insertion-tour',
        data: {
            data: doc,
        },
    });

});

exports.createOne = Model => catchAsync(async (request, response, next) => {
    const doc = await Model.create(request.body);
    response.status(200).json({
        status: 'successfully',
        data: {
            content: doc,
        },
    });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (request, response, next) => {
    var query = Model.findById(request.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (doc == null) {
        return next(new AppError('No document found with this ID', 404))
    }
    response.status(200).json({
        status: 'sucess-fetch-with-id',
        doneAt: request.myTime,
        data: {
            doc,
        },
    });

});

exports.getAll = Model => catchAsync(async (request, response, next) => {
    //to get nested reviews
    let filter = {};
    if (request.params.tourID) filter = {
        tour: request.params.tourID
    }
    const features = new APIFeature(Model.find(filter), request.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;

    response.status(200).json({
        status: 'sucess',
        results: doc.length,
        data: {
            doc,
        },
    });
    next();

});