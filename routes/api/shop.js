const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Config
const config = require('../../config/keys');

//Validation
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');

const router = express.Router();

//Load Schema
const Profile = require('../../dbSchemas/dbModels/Profile');
const User = require('../../dbSchemas/dbModels/User');
const Comment = require('../../dbSchemas/dbModels/Comment');
const ShopItem = require('../../dbSchemas/dbModels/ShopItem');

/**
 * @swagger
 * tags:
 *   name: Shop
*/

/**
 * @swagger
 *
 *  /api/shop/:
 *      post:
 *          tags: [Shop]
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const shopItem = new ShopItem({
        user: req.user.id,
        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        cost: req.body.cost,
        imageList: req.body.imageList,
        paymentOptions: req.body.paymentOptions,
        titleImage: req.body.titleImage,
        currency: req.body.currency
    })

    shopItem.save().then(shopItem => res.status(200).json({1: 'ok'}))
});

/**
 * @swagger
 *
 *  /api/shop/:
 *      get:
 *          tags: [Shop]
 */
router.get('/', (req, res) => {
    ShopItem.find()
    .populate('user', ['name', 'avatar'])
    .then(shopItem => res.status(200).json(shopItem))
});

/**
 * @swagger
 *
 *  /api/shop/three:
 *      get:
 *          tags: [Shop]
 */
router.get('/three', (req, res) => {
    ShopItem.find()
    .limit(14)
    .populate('user', ['name', 'avatar'])
    .then(shopItem => res.status(200).json(shopItem))
});

/**
 * @swagger
 *
 *  /api/shop/item/:shop_id:
 *      get:
 *          tags: [Shop]
 */
router.get('/item/:shop_id', (req, res) => {
    ShopItem.findOne({_id: req.params.shop_id})
        .populate('user', ['name', 'avatar'])
        .then(shopItem => res.status(200).json(shopItem))
});

/**
 * @swagger
 *
 *  /api/shop/item/:shop_id:
 *      delete:
 *          tags: [Shop]
 */
router.delete('/item/:shop_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Work.findOneAndRemove({_id: req.params.shop_id})
        .then(shopItem => res.status(200).json(shopItem))
});

/**
 * @swagger
 *
 *  /api/shop/item/:shop_id:
 *      put:
 *          tags: [Shop]
 */
router.put('/item/:shop_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const updateShop = {
        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        imageList: req.body.imageList,
        titleImage: req.body.titleImage,
        cost: req.body.cost,
        paymentOptions: req.body.paymentOptions,
        currency: req.body.currency
    }

    Work.findOneAndUpdate(
        {$set: updateShop}
    ).then(res.status(200))
});

/**
 * @swagger
 *
 *  /api/shop/search:
 *      post:
 *          tags: [Shop]
 */
router.post('/search', (req, res) => {
    let find = {};
    let param = req.body;

    if (param.category !== '') {
        find = {category: param.category}
    } else if (param.title !== '') {
        find = {title: param.title}
    } else if (param.title !== '' && param.category !== '') {
        find = {category: param.category, title: param.title}
    }
    
    if(param.sortBy === 'date') {
        ShopItem.find(find)
        .sort('-date')
        .populate('user', ['name', 'avatar'])
        .then(ShopItem => res.status(200).json({ShopItem, find}))
    } else if(param.sortBy === 'salary') {
        ShopItem.find(find)
        .sort({cost: -1})
        .populate('user', ['name', 'avatar'])
        .then(ShopItem => res.status(200).json({ShopItem, find}))
    } else {
        ShopItem.find(find)
        .populate('user', ['name', 'avatar'])
        .then(ShopItem => res.status(200).json({ShopItem, find}))
    }
})

module.exports = router;