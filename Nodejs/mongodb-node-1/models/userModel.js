const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    passwordChangedAt: Date
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

const User = mongoose.model('User', userSchema)
module.exports = User