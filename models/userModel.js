const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a valid name..!'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Enter a email id that is valid']
    },
    photo: {
        type: String,
        // required: [true, 'Upload a picture!'],
    },
    password: {
        type: String,
        required: [true, 'Enter the password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Should match the previous password!'],
        validate: {
            //ONLY ON CREATE() AND SAVE() NOT ON UPDATE()
            validator: function (value) {
                return value === this.password
            }
        }
    },
    passwordChangedAt: {
        type: Date,
        select: true,
    }

});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
})
//Following fucntion is a instance method available on each document
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//     if (this.passwordChangedAt) {
//         console.log(this.passwordChangedAt, JWTTimestamp)
//         const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 100, 10);
//         return JWTTimestamp > changedTimestamp;
//     }
//     return false; //Not changed
// }

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;