const express = require('express')
const app = express()

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/user', userRouter)

app.all('*', (req, res, next) => {
    const err = new AppError('Could not find the page being requested !', 400)
    next(err)
})

app.use(errorController)
module.exports = app