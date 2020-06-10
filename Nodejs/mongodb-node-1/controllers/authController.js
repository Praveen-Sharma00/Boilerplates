const User = require('../models/userModel')

const asyncHandler = require('../utils/asyncHandler')


exports.signup = asyncHandler(async (req, res, next) => {
    const newUser = new User(req.body)
    await newUser.save();
    res.status(200).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
})