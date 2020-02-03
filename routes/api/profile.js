const express = require('express');
const passport = require('passport');

//Create profile router
const router = express.Router();

//Load Profile Schema
const Profile = require('../../dbSchemas/dbModels/Profile');
//Load User Schema
const User = require('../../dbSchemas/dbModels/User');

/**
 * @swagger
 * tags:
 *   name: Profile
*/

/**
 * @swagger
 *
 *  /api/profile/user/:user_id:
 *      get:
 *          tags: [Profile]
 */
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }else{
                res.json(profile);
            }

           // res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/profile/:
 *      post:
 *          tags: [Profile]
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const profileUpdate = {
        surname: req.body.surname,
        firstname: req.body.firstname,
        skills: req.body.skills,
        location: req.body.location,
        bio: req.body.bio,
        gender: req.body.gender,
        birthday: req.body.birthday
    }

    Profile.findOneAndUpdate(
        { user: req.user._id }, 
        {$set: profileUpdate}
    )
    .then(profile => res.json(profile))
    .catch(err => console.log(err))
});

const UserWork = require('../../dbSchemas/dbModels/UserWork');

/**
 * @swagger
 *
 *  /api/profile/work/:work_id:
 *      get:
 *          tags: [Profile]
 */
router.get('/work/:work_id', (req, res) => {
    const errors = {};
    UserWork.findOne({ _id: req.params.work_id})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }else{
                res.json(profile);
            }
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/profile/user/:user_id/image:
 *      get:
 *          tags: [Profile]
 */
router.get('/user/:user_id/image', (req, res) => {
    const errors = {};
    UserWork.find({ user: req.params.user_id, contentType: 'image'})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }else{
                res.json(profile);
            }
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/profile/user/:user_id/video:
 *      get:
 *          tags: [Profile]
 */
router.get('/user/:user_id/video', (req, res) => {
    const errors = {};
    UserWork.find({ user: req.params.user_id, contentType: 'video'})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {  
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/profile/user/:user_id/music:
 *      get:
 *          tags: [Profile]
 */
router.get('/user/:user_id/music', (req, res) => {
    const errors = {};
    UserWork.find({ user: req.params.user_id, contentType: 'music'})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {  
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

module.exports = router;