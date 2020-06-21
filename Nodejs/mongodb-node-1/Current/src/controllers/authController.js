import jwt from 'jsonwebtoken'

import UserModel from '../models/UserModel'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/appError'

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

const registerUser = asyncHandler(async (req, res, next) => {
    const newUser = new UserModel({
        name: req.body['name'],
        email: req.body['email'],
        photo: req.body['photo'],
        password: req.body['password'],
        passwordConfirm: req.body['passwordConfirm']
    })
    await newUser.save()
    return res.status(200).json({
        message: 'Account successfully created !',
        status:'success',
        statusCode:200
    })
})
const loginUser = asyncHandler(async (req, res, next) => {
    let {email, password} = req.body
    if (!email || !password) {
        return next(new AppError('Please provide email and password !', 400))
    }
    const user = await UserModel.findOne({email}).select('+password')

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password !', 401))
    }
    createAndSendToken(user, 200, res)
})

const AuthController = {
    registerUser, loginUser
}
export default AuthController