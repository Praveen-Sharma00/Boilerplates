const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const verifyToken = require('../middlewares/verifyToken')

router.route('/home')
    .get(verifyToken, userController.home)


module.exports = router
