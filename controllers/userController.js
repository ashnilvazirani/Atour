const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (request, response) => {
    const user = await User.find();
    response.status(200).json({
        status: 'sucess',
        results: user.length,
        data: {
            user,
        },
    });
});
exports.getUser = (request, response) => {
    response.status(500).json({
        status: 'pending',
        message: 'this router is not yet implemented',
    });
};
exports.createUser = (request, response) => {
    response.status(500).json({
        status: 'pending',
        message: 'this router is not yet implemented',
    });
};
exports.updateUser = (request, response) => {
    response.status(500).json({
        status: 'pending',
        message: 'this router is not yet implemented',
    });
};
exports.deleteUser = (request, response) => {
    response.status(500).json({
        status: 'pending',
        message: 'this router is not yet implemented',
    });
};