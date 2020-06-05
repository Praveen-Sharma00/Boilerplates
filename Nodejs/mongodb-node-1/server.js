const dotenv = require('dotenv');
const logUtils = require('./utils/logger');

dotenv.config({
    path: './config.env'
})

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        logSuccess('DB Connection established !');
    })
    .catch((err) => {
        logError('Error connecting to DB');
    })

const app = require('./app');
app.listen(process.env.PORT, () => {

    logSuccess('Server listening on port ' + process.env.PORT + ' !');
})