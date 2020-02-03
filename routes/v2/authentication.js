const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('express-validation');

const config = require('../../config/keys');
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');
const Profile = require('../../dbSchemas/dbModels/Profile');
const UserV2 = require('../../dbSchemas/v2/User');
const {ErorrHandling} = require('../../models/index');
const {errorHandler} = require('../../helpers/index');
const {REGISTRATION_VALIDATION} = require('../../validation/index');
const {errorLocalization} = require('../../middleware/index');

const router = express.Router();

router.post(
  '/registration',
  validate(REGISTRATION_VALIDATION),
  errorLocalization(),
  async (req, res, next) => {
  try {
    //const { errors, isValid } = validateRegisterInput(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors)
    // }

    const { login, email, password } = req.body;

    const user = await User.findOne({ login });

    if (user) {
      throw new ErorrHandling(400, 'Login alredy exists');
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

router.post('/login', async (req, res) => {
  try {
    const { errors, isValid} = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    };

    const { login, password } = req.body;

    const user = await User.findOne({ login });

    if (!user) {
      errors.name = 'User not found';
      return res.status(404).json(errors);
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if(!passwordIsMatch) {
      errors.password = 'Password incorect';
      res.status(400).json(errors);
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
    )

    res.status(200).json({
      token,
    })
  } catch (err) {
    console.log(err)
  }
});

router.use((err, req, res, next) => {
  errorHandler(err, res);
  next();
});

module.exports = router;
