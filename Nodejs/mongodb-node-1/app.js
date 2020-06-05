const express = require('express');
const app = express();

const AppError = require('./utils/appError');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('*', (req, res, next) => {
    next(new AppError('Server cannot find the requested page'));
})
module.exports = app;