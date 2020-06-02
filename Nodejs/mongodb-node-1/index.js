const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logUtils = require("./utils/logger.js");

dotenv.config({
  path: "./config.env",
});
mongoose
  .connect(process.env.DB_PROD_URL, {
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
