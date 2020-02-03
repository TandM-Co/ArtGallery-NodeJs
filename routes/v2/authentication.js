const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../config/keys');
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');
const Profile = require('../../models/dbModels/Profile');
const UserV2 = require('../../models/v2/User');

const router = express.Router();

router.post('/registration', async (req, res) => {
  try {
    const { errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors)
    }

    const { login, email, password } = req.body;

    const user = await User.findOne({ login });

    if (user) {
      errors.login = 'Login alredy exists';
      return res.status(400).json(errors);
    }

    const newUser = new UserV2({
      email,
      password,
      login,
    });

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(newUser.passport, salt);

    newUser.password = passwordHash;

    const createdUser = await newUser.save();

    const newProfile = new Profile({
      user: createdUser._id,
    });

    await newProfile.save();

    res.status(200).json({});
  } catch (err) {
    console.log(err)
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

module.exports = router;
