import mongoose from 'mongoose'
import validator from 'validator'

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
    photo:{
      type:String, default:null
    },
    password: {
        type: String,
        required: true,
        minLength:6
    },
    passwordConfirm: {
        type: String,
        required: true,
        minLength:6,
        // validate: {
        //     validator: function (el) {
        //         return el === this.password
        //     },
        //     message: "Passwords dont match !"
        // }
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
