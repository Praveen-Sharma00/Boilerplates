const jwt = require('jsonwebtoken')


const User = require('../models/userModel')

const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
exports.signup = asyncHandler(async (req, res, next) => {
    const newUser = new User(req.body)
    const token = signToken(newUser._id)
    await newUser.save();
    res.status(200).json({
        status: 'success',
        data: {
            user: newUser,
            token: token
        }
    })
})

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    const user = await User.findOne({ email: email }).select('+password')


    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }

    const token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token: token
    })
})