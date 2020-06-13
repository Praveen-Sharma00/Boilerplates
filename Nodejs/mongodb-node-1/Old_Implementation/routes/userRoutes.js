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

router.route('/forgot-password')
    .post(authController.forgotPassword)

router.route('/reset-password/:token')
    .patch(authController.resetPassword)

router.route('/update-password')
    .patch(authenticateUser, authController.updatePassword)

module.exports = router
