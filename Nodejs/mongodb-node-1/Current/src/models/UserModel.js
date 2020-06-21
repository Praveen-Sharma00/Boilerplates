import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        minlength: 4,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords dont match !'
        }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresAt: {
        type: Date
    }
}, {
    timestamps: true
})
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})
UserSchema.methods.correctPassword = async function (givenPassword, actualPassword) {
    return await bcrypt.compare(givenPassword, actualPassword)
}
const UserModel = mongoose.model('User', UserSchema)
export default UserModel