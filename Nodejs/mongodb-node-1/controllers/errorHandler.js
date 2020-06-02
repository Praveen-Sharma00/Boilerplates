const AppError = require("../utils/appError");

const sendDevErrors = (err, res) => {
  res.status(err.status).json({
    message: err.message,
    status: err.status,
    stack: err.stack,
    error: err,
  });
};
const sendProdErrors = (err, res) => {
  if (err.isOperational) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Some error occurred on server !",
    });
  }
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value : ${value}. Please use another value`;

  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid input data. ${errors.join(". ")} `;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevErrors(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    sendProdErrors(error, res);
  }
};
