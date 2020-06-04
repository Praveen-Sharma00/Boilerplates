const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logUtils = require("./utils/logger.js");

dotenv.config({
  path: "./config.env",
});
mongoose
  .connect(process.env.DB_DEV_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    logSuccess("DB connection established successfully !");
  })
  .catch((err) => {
    logError("DB connection failed " + err);
  });

const app = require("./app");

app.listen(process.env.PORT, () => {
  logSuccess("Server running on PORT " + process.env.PORT);
});

process.on('unhandledRejection', err => {
  logError('Unhandled rejection !. Shutting Down...')
  process.exit(1);
})

process.on('uncaughtException', err => {
  logError('Uncaught exception !. Shutting Down...')
  process.exit(1);
})