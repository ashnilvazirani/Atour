const User = require('./../models/userModel');
const {
    promisify
} = require('util');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}
exports.signup = catchAsync(async (request, response, next) => {
    const newUser = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        passwordChangedAt: request.body.passwordChangedAt,
    });
    const token = signToken(newUser._id);

    response.status(200).json({
        status: 'successfully created user',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (request, response, next) => {
    const {
        email,
        password
    } = request.body;


    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    response.status(200).json({
        message: 'success-login',
        token
    })
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token)
    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('id:' + decoded.id)

    // // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // // 4) Check if user changed password after the token was issued
    //decoded.iat is the JWT timeStamp
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});