const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Config
const config = require('../../config/keys');

//Validation
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');

//Create User router
const router = express.Router();

//User model
const User = require('../../models/dbModels/User');
const UserWork = require('../../models/dbModels/UserWork');

//
const Profile = require('../../models/dbModels/Profile');

/**
 * @swagger
 * tags:
 *   name: Users
*/

/**
 * @swagger
 *
 *  /api/user/avatar:
 *      post:
 *          tags: [Users]
 */
router.post('/avatar', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.findOneAndUpdate(
        {name: req.user.name},
        {avatar: req.body.avatar}
    ).then(vul => res.json(vul))
})

 /**
 * @swagger
 *
 *  /api/user/register:
 *      post:
 *          tags: [Users]
 */
router.post('/register', (req, res) => {
    const { errors, isValid} = validateRegisterInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({ name: req.body.name })
        .then(user =>{
            if(user){
                errors.name = 'Username alredy exists';
                return res.status(400).json(errors);
            } else {
                const newUser = User({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;

                        newUser.save()
                            .then(user => {
                                User.findOne({ name: newUser.name})
                                    .then(user => {
                                        const newProfile = Profile({
                                            user: user._id
                                        })
                                        newProfile.save()
                                            .then(res.status(200).json({isTrue: true}))
                                    })
                            })
                            .catch(err => console.log(err));
                    })
                })
            }
        });
});

 /**
 * @swagger
 *
 *  /api/user/login:
 *      post:
 *          tags: [Users]
 */
router.post('/login', (req, res) => {
    const { errors, isValid} = validateLoginInput(req.body);

    if(!isValid){
      return res.status(400).json(errors)
    };

    User.findOne({'name': req.body.name })
        .then(user => {
            if(!user){
              errors.name = 'User not found';
              return res.status(404).json(errors);
            }

            bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            admin: user.admin
                        };
                        //Create Token
                        jwt.sign(
                            payload,
                            config.secretOrKey,
                            {expiresIn: '999999999999 days'},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        )
                } else {
                    errors.password = 'Password incorect';
                    res.status(400).json(errors);
                }
            });

        })
});

 /**
 * @swagger
 *
 *  /api/user/userWork:
 *      post:
 *          tags: [Users]
 */
router.post('/userWork', passport.authenticate('jwt', {session: false}), (req, res) => {
    const userWork = new UserWork({
        user: req.user.id,
        title: req.body.title,
        text: req.body.text,
        contentType: req.body.contentType,
        contentRef: req.body.contentRef,
        titleImage: req.body.titleImage,
        imageWidth: req.body.imageWidth
    });
    userWork.save().then(userWork => res.status(200).json(userWork))
});


module.exports = router;
