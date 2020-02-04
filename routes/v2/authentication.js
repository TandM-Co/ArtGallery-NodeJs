const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('express-validation');

const config = require('../../config/keys');
const Profile = require('../../dbSchemas/dbModels/Profile');
const UserV2 = require('../../dbSchemas/v2/User');
const {ErorrHandling} = require('../../models/index');
const {errorHandler} = require('../../helpers/index');
const {
  REGISTRATION_VALIDATION,
  LOGIN_VALIDATION
} = require('../../validation/index');
const {errorLocalization} = require('../../middleware/index');

const router = express.Router();

router.post(
  '/registration',
  validate(REGISTRATION_VALIDATION),
  async (req, res, next) => {
  try {
    const { login, email, password } = req.body;

    const user = await User.findOne({ login });

    if (user) {
      throw new ErorrHandling(
        400,
        'Login alredy exists',
        [{
          field: ['login'],
          messages: ['"login" already exist']
        }]
      );
    }

    const newUser = new UserV2({
      email,
      password,
      login,
    });

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(newUser.password, salt);

    newUser.password = passwordHash;

    const createdUser = await newUser.save();

    const newProfile = new Profile({
      user: createdUser._id,
    });

    await newProfile.save();

    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

router.post(
  '/login',
  validate(LOGIN_VALIDATION),
  async (req, res, next) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });

    if (!user) {
      throw new ErorrHandling(
        400,
        'Login not found',
        [{
          field: ['login'],
          messages: ['"login" not found']
        }]
      );
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if(!passwordIsMatch) {
      throw new ErorrHandling(
        400,
        'Password incorect',
        [{
          field: ['password'],
          messages: ['"password" incorect']
        }]
      );
    }

    const payload = {
      id: user.id,
      name: user.login,
      avatar: user.avatar,
      role: user.role,
    };

    const token = await jwt.sign(
      payload,
      config.secretOrKey,
      {expiresIn: '999999999999 days'},
    );

    res.status(200).json({
      token,
    });
  } catch (err) {
    next(err);
  }
});

router.use(errorLocalization, errorHandler);

module.exports = router;
