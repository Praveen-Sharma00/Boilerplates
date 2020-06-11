const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const authenticateUser = require('../middlewares/authenticateUser')

router.route('/home')
    .get(authenticateUser, userController.home)


module.exports = router
