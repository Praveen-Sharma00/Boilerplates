const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const User = require('../models/userModel')

const asyncHandler = require('../utils/asyncHandler')

const AppError = require('../utils/appError')
const sendEmail = require('../utils/sendEmail')


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN),
        secure: true,
        httpOnly: true,
    }
    if (process.env.NODE_ENV === 'production')
        cookieOptions['httpOnly'] = true

    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        data: { user, token }
    })
}
exports.signup = asyncHandler(async (req, res, next) => {
    const newUser = new User(req.body)

    await newUser.save();
    createSendToken(newUser, 201, res)
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

    createSendToken(user, 200, res)
})

exports.resetPassword = asyncHandler(async (req, res, next) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    if (!user) {
        return next(new AppError('Token in invalid or expired !'))
    }
    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('Passwords dont match !'))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangedAt = Date.now()

    await user.save()

    createSendToken(user, 200, res)
})

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    if (!req.body.email) {
        return next(new AppError("Please provide your email !", 404))
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError("There is no user with that email !", 404))
    }
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    const resetURL = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;

    const message = `To reset the password , please click on ${resetURL}.\n Thank you.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset link valid for 10 mins',
            message: message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })
    } catch (e) {
        user.createPasswordResetToken = undefined
        user.passwordResetExpires = undefined

        return next(new AppError('There was an error sending email. Try again later !', 500))
    }

})

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password')
    if (!(user.correctPassword(req.body.passwordConfirm, user.password))) {
        return next(new AppError('Your current password is incorrect !', 401))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordChangedAt = Date.now()
    await user.save()
    createSendToken(user, 200, res)
})