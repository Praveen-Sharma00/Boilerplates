import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid Email']
    },
    password: {
        type: String,
        required: true,
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Passwords dont match !"
        }
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date,
        default: undefined
    },
    passwordChangedAt: {
        type: Date,
        default: undefined
    }
})

const UserModel = mongoose.model('UserModel', UserSchema)

export default UserModel
