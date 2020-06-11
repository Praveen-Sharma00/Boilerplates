const asyncHandler = require('../utils/asyncHandler')

exports.home = asyncHandler((req, res, next) => {
    return res.json({
        user: req.user
    })
}) 