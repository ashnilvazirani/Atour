const User = require('./../models/userModel');
const AppError = require('./../utils/appError')
// const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./generalHandler');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        console.log(ext);
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
})
// const multerStorage = multer.memoryStorage();
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
exports.resizeUserPhoto = async (req, res, next) => {
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
    next();
}
exports.uploadUserPhoto = upload.single('photo');
exports.updateMe = catchAsync(async (request, response, next) => {
    try {
        if (request.body.password || request.body.confirmPassword) {
            return next(new AppError('This route is not for updating password', 400));
        }
        const data = filterFields(request.body, 'name', 'email');
        if (request.file) data.photo = request.file.filename;
        const user = await User.findByIdAndUpdate(request.user._id, data, {
            new: true,
            runValidators: true
        });
        response.status(200).json({
            status: "successfully",
            data: {
                user
            }
        });
    } catch (error) {
        console.log(error);
    }
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