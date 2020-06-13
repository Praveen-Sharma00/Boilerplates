const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')


const app = express()

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')


app.use('/api', rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP'
}))
app.use(helmet)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(express.static(`${__dirname}/public`))


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.all('*', (req, res, next) => {
    const err = new AppError('Could not find the page being requested !', 400)
    next(err)
})
app.use(errorController)


module.exports = app