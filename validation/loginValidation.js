const Joi = require('joi');

module.exports = {
  body: {
    login: Joi.string().required().max(12).min(3),
    password: Joi.string().required().max(12).min(6),
  }
};
