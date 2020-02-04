const {errorLocalize} = require('../localization/index');

const errorLocalization = (err, req, res, next) => {
  const localizedErr = err.errors.map(error => {
    const localizedMessage = error.messages.map((message) => {
      return errorLocalize.translate(message)
    })
    const localizedError = {
      ...error,
      messages: localizedMessage,
    };
    return localizedError;
  })
  const error = {
    ...err,
    errors: localizedErr
  }
  next(error)
}

module.exports = errorLocalization;
