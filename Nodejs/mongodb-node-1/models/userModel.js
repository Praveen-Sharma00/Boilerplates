const mongoose = require('mongoose')
const validator = require('validator')


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
        minLength: 6
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
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User