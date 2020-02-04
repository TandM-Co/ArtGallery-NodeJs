const { errorLocalize } = require('../localization/index');

const switchLocale = (req, res, next) => {
  const lang = req.headers["accept-language"] || 'ru';
  errorLocalize.setLocale(lang);
  next();
};

module.exports = switchLocale;
