const express = require("express");
const app = express();



app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const errorHandler = require('./controllers/errorHandler');

app.use('/api/v1/users', userRoutes);
app.use(errorHandler);

module.exports = app;
