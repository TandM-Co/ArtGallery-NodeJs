const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const transporter = require('../../mail/nodemailer');

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
const Profile = require('../../models/dbModels/Profile');
const Work = require('../../models/dbModels/Work');
const WorkRequest = require('../../models/dbModels/WorkRequest');

/**
 * @swagger
 * tags:
 *   name: Work
*/

/**
 * @swagger
 *
 *  /api/work/:
 *      post:
 *          tags: [Work]
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const work = new Work({
        user: req.user.id,
        title: req.body.title,
        task: req.body.task,
        requirements: req.body.requirements,
        category: req.body.category,
        jobType: req.body.jobType,
        currency: req.body.currency,
        cost: req.body.cost,
        paymentOptions: req.body.paymentOptions
    })

    work.save().then(work => res.status(200).json({1: 'ok'}))
})

/**
 * @swagger
 *
 *  /api/work/:
 *      get:
 *          tags: [Work]
 */
router.get('/', (req, res) => {
    const category = req.query;
    Work.find(category)
    .populate('user', ['name', 'avatar'])
    .then(work => res.status(200).json(work))
})

/**
 * @swagger
 *
 *  /api/work/item/:work_id:
 *      get:
 *          tags: [Work]
 */
router.get('/item/:work_id', (req, res) => {
    Work.findOne({_id: req.params.work_id})
        .populate('user', ['name', 'avatar'])
        .then(work => res.status(200).json(work))
});

/**
 * @swagger
 *
 *  /api/work/request:
 *      post:
 *          tags: [Work]
 */
router.post(
    '/request',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
    try {
        const { id } = req.user;
        const { work, text } = req.body;

        const newWorkRequest = new WorkRequest({
            text,
            work,
            user: id,
        });

        await newWorkRequest.save();

        const user = await User.findById(id);
        const workInfo = await Work.findById(work)
            .populate('user');

        const mailForCustomer = {
            from: '"ArtGallery"',
            to: `${user.email}`,
            subject: "Запрос на выполнение заказа",
            template: 'work-request',
            context: {
                userCustomer: workInfo.user,
                text,
                user: req.user,
                workInfo,
                ref: `https://shielded-mountain-95509.herokuapp.com/work/${workInfo.id}`,
                message: 'У вас появился новый запрос на выполнение заказа'
            }
        };

        await transporter.sendMail(mailForCustomer)

        res.status(200).json({message: 'Request successfully created'})
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 * @swagger
 *
 *  /api/work/request/check/:id:
 *      get:
 *          tags: [Work]
 */
router.get(
    '/request/check/:id',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
    try {
        const { id } = req.params;

        const workRequest = await WorkRequest
        .find({
            work: id,
            user: req.user.id
        })
        .populate('user');

        if(workRequest && workRequest.length != 0) {
            return res.status(200).json({
                check: false,
                checkedRequest: workRequest,
            })
        }

        res.status(200).json({check: true})
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 * @swagger
 *
 *  /api/work/request/:id:
 *      get:
 *          tags: [Work]
 */
router.get(
    '/request/:id',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
    try {
        const { id } = req.params;

        const workRequest = await WorkRequest
        .find({work: id})
        .populate('user')

        res.status(200).json(workRequest)
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 * @swagger
 *
 *  /api/work/request/:id:
 *      delete:
 *          tags: [Work]
 */
router.delete(
    '/request/:id',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
    try {
        const { id } = req.params;

        await WorkRequest.findByIdAndDelete(id)

        res.status(200).json({message: 'Request was deleted successefully'})
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 * @swagger
 *
 *  /api/work/item/:work_id:
 *      delete:
 *          tags: [Work]
 */
router.delete('/item/:work_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Work.findOneAndRemove({_id: req.params.work_id})
        .then(work => res.status(200).json(work))
});

/**
 * @swagger
 *
 *  /api/work/item/:work_id:
 *      put:
 *          tags: [Work]
 */
router.put('/item/:work_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const updateWork = {
        title: req.body.title,
        task: req.body.task,
        requirements: req.body.requirements,
        category: req.body.category,
        jobType: req.body.jobType,
        currency: req.body.currency,
        cost: req.body.cost,
        paymentOptions: req.body.paymentOptions,
        updateDate: Date.now()
      }

    Work.findOneAndUpdate(
        {$set: updateWork}
    ).then(res.status(200))
});

/**
 * @swagger
 *
 *  /api/work/search:
 *      post:
 *          tags: [Work]
 */
router.post('/search', (req, res) => {
    let find = {};
    let param = req.body;

    if(param.category != '')
        find = {category: req.body.category}
    else if(param.jobType != '')
        find = {jobType: req.body.jobType}
    else if(param.category != '' && param.jobType != '')
        find = {jobType: req.body.jobType, category: req.body.category}

    if(param.sortBy === 'date'){
        Work.find(find)
        .sort('-date')
        .populate('user', ['name', 'avatar'])
        .then(work => res.status(200).json({work, find}))
    } else if(param.sortBy === 'salary'){
        Work.find(find)
        .sort({cost: -1})
        .populate('user', ['name', 'avatar'])
        .then(work => res.status(200).json({work, find}))
    } else {
        Work.find(find)
        .populate('user', ['name', 'avatar'])
        .then(work => res.status(200).json({work, find}))
    }
});




// router.get('/user/:user_id/video', (req, res) => {
//     const errors = {};
//     UserWork.find({ user: req.params.user_id, contentType: 'video'})
//         .populate('user', ['name', 'avatar']) //User collection
//         .then(profile => {
//             res.json(profile);
//         })
//         .catch(err => res.status(404).json(err));
// });

module.exports = router;
