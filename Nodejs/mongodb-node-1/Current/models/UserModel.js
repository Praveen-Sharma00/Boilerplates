import mongoose from 'mongoose'
import validator from 'validator'

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
        minLength: 4
    },
    passwordConfirm: {
        type: String,
        required: true,
        minLength: 4,
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

const UserModel = mongoose.model('User', UserSchema)
export default UserModel