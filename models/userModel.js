const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
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
        default: 'default.jpg'
        // required: [true, 'Upload a picture!'],
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
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
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    //this -1000 means that we are removing 1 second from current time stamp since, in practical the tokenis created before the password change
    // and so while logging in, our code will return false while comparing the timestamps and hence no login possible
    next();
})
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
userSchema.pre(/^find/, function (next) {
    this.find({
        active: {
            $ne: false
        }
    });
    next();
})
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
userSchema.methods.creatPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    return resetToken;
}
const User = mongoose.model('User', userSchema);
module.exports = User;