const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

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
        status: 'success-insertion-tour',
        data: {
            content: doc,
        },
    });
});