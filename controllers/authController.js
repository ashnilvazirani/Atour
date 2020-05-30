const User = require('./../models/userModel');
const email = require('./../utils/email')
const crypto = require('crypto');
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
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'successfully',
        token,
        data: {
            user
        }
    });
}
exports.signup = catchAsync(async (request, response, next) => {
    const newUser = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        passwordChangedAt: request.body.passwordChangedAt,
        role: request.body.role,
    });
    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, response);
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
    console.log('token:' + token)
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

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //{...roles}= ['admin', 'lead-guide']
        console.log('ROLE:' + req.user.email)
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not authorized for doing this.', 403));
        }
        next();
    }
}


exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        console.log('no')
        return next((new AppError('Not found with this email', 404)));
    }
    const resetToken = user.creatPasswordResetToken();
    // await user.save();
    await user.save({
        validateBeforeSave: false
    });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;
    const message = `Your link to forgot password is given below\n${resetURL}\nClick to change your password else fuck off!`;
    try {

        await email.sendEmail({
            email: user.email,
            subject: 'Request to reset password(valid for 10 minutes)',
            message
        })
        res.status(200).json({
            status: 'success-reset-password',
            message: 'token sent to email'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });
        return next(new AppError('Error in sending mail', 500))
    }
    next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //get the token from url
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log('hi')
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });
    //if not expired then allow to login
    if (!user) {
        return next((new AppError('Invalid token or token expired', 400)));
    }
    //updatepassword
    console.log(user)
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //set token and login

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //get the user from database
    // console.log(req.user)
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        return next((new AppError('Not found with this email', 404)));
    }
    //check if password is correct
    if (!await user.correctPassword(req.body.passwwordCurrent, user.password)) {
        return next(new AppError('incorrect password, cannot change it', 404))
    }
    //if yes, update with new password

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    //login user
    createSendToken(user, 200, res)
});