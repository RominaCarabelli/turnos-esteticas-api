function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    Number.isInteger(error.status) &&
    error.status >= 400 &&
    error.status <= 599
      ? error.status
      : 500;

  const message =
    statusCode === 500
      ? "Ocurrió un error interno del servidor."
      : error.message;

  return res.status(statusCode).json({
    message,
  });
}

module.exports = errorHandler;