const express = require('express');
const userRouter = express.Router();
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
userRouter.post('/forgotpassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protect);
//AFTER this point every router needs authentication and so we just used our middleware and interted in the execution stack
//so no need to mention .protect() to next routes
userRouter.patch('/updatePassword', authController.updatePassword);
userRouter.patch('/updateMe', userController.updateMe);
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.route('/me').get(userController.getMe, userController.getUser);

userRouter.use(authController.restrictTo('admin'))
userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = userRouter;