const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const authenticateUser = require('../middlewares/authenticateUser')
const authoriseUser = require('../middlewares/authoriseUser')

router.route('/home')
    .get(authenticateUser, userController.home)

router.route('/settings')
    .get(authenticateUser,
        authoriseUser.restrictTo('admin'),
        userController.settings)

router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

module.exports = router
