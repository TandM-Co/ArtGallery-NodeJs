const express = require('express');
const passport = require('passport');

//Create profile router
const router = express.Router();

//Load Profile Schema
const Profile = require('../../models/dbModels/Profile');
//Load User Schema
const User = require('../../models/dbModels/User');
const Comment = require('../../models/dbModels/Comment');

/**
 * @swagger
 * tags:
 *   name: Gallery
*/

/**
 * @swagger
 *
 *  /api/galery/video:
 *      get:
 *          tags: [Gallery]
 */
router.get('/video', (req, res) => {
    const errors = {};
    UserWork.find({contentType: 'video'})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/galery/music:
 *      get:
 *          tags: [Gallery]
 */
router.get('/music', (req, res) => {
    const errors = {};
    UserWork.find({contentType: 'music'})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/galery/image:
 *      get:
 *          tags: [Gallery]
 */
router.get('/image', (req, res) => {
    const errors = {};
    UserWork.find({contentType: 'image'})
        .populate('user', ['name', 'avatar']) //User collection
        .limit(11)
        .then(profile => {
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/galery/image/moreimag:
 *      post:
 *          tags: [Gallery]
 */
router.post('/image/moreimage', (req, res) => {
    const errors = {};
    UserWork.find({contentType: 'image'})
        .populate('user', ['name', 'avatar']) //User collection
        .skip(req.body.skip)
        .limit(11)
        .then(profile => {
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/galery/video/:video_id:
 *      get:
 *          tags: [Gallery]
 */
router.get('/video/:video_id', (req, res) => {
    const errors = {};
    UserWork.find({contentType: 'video', _id: req.params.video_id})
        .populate('user', ['name', 'avatar']) //User collection
        .then(profile => {
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @swagger
 *
 *  /api/galery/video/post/:news_id:
 *      post:
 *          tags: [Gallery]
 */
router.post('/post/:news_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const comment = new Comment({
        user: req.body.user,
        news: req.params.news_id,
        text: req.body.comment
    })

    comment.save().then(comment => res.json(comment))
});


module.exports = router;
