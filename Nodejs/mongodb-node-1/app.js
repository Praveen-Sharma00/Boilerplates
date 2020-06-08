const express = require('express')
const app = express()

const AppError = require('./utils/appError')


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.all('*', (req, res ,next)=>{
    const err= new AppError('Could not find the page being requested !')
    next(err)
})

module.exports = app