const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {DB_CONSTANTS, ROLE_CONSTANTS} = require('../../constants/index');

const userSchemaV2 = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: DB_CONSTANTS.DEFAULT_AVATART,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: ROLE_CONSTANTS.USER,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isTelephoneNumberVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = User = mongoose.model('userV2', userSchemaV2);
