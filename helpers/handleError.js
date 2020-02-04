const handleError = (err, req, res, next) => {
  const {statusCode = 400, message, errors} = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    errors,
  });
};

module.exports = handleError;
