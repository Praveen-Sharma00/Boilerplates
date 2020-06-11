const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const asyncHandler = require('../utils/asyncHandler')

const AppError = require('../utils/appError')
const User = require('../models/userModel')

const decodeToken = async (token) => {
    return await promisify(jwt.verify)(token, process.env.JWT_SECRET)
}
module.exports = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError("You are not logged in !", 401))
    }
    const decode = await decodeToken(token)
    const authUser = await User.findById(decode.id)
    console.log(authUser)
    if (!authUser) {
        return next(new AppError("The user does not exist !", 401))
    }
    if (authUser.changedPasswordAfter(decode.iat)) {
        return new AppError('User recently changed password.Please login again', 401)
    }
    req.user = authUser

    return next()
}) 