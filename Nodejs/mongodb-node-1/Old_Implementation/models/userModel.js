const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email !']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        minLength: 6,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Passwords don't match !"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function (givenPassword, actualPassword) {
    return await bcrypt.compare(givenPassword, actualPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        return JWTTimestamp < changedTimeStamp
    }
}

userSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}
const User = mongoose.model('User', userSchema)
module.exports = User