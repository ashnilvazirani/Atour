const User = require('./../models/userModel');
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');
const factory = require('./generalHandler');

const filterFields = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = (request, response) => {
    response.status(500).json({
        status: 'pending',
        message: 'this router is not yet implemented',
    });
};

exports.getMe = (request, respone, next) => {
    request.params.id = request.user.id;
    next()
}
exports.updateMe = catchAsync(async (request, response, next) => {
    if (request.body.password || request.body.confirmPassword) {
        return next(new AppError('This route is not for updating password', 400));
    }
    const data = filterFields(request.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(request.user._id, data, {
        new: true,
        runValidators: true
    });
    response.status(200).json({
        status: 'sucess-update',
        data: {
            user
        }
    });
    next();
});

exports.deleteMe = catchAsync(async (request, response, next) => {
    const user = await User.findByIdAndUpdate(request.user.id, {
        active: false
    }, {
        new: true,
        runValidators: true
    });
    response.status(204).json({
        status: 'success-delete',
    })
    next();
});

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);