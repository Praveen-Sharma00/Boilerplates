const asyncHandler = require('../utils/asyncHandler')

exports.home = asyncHandler((req, res, next) => {
    return res.json({
        user: req.user
    })
})

exports.settings = asyncHandler((req, res, next) => {
    return res.json({
        message: 'settings working !'
    })
})