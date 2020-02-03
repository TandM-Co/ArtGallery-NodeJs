const express = require('express');
const router = express.Router();
const passport = require('passport');

//const errorModel = require('../models/error');
const Basket = require('../../models/dbModels/Basket');

/**
 * @swagger
 * tags:
 *   name: Basket
*/

/**
 * @swagger
 *
 *  /api/basket/:
 *      put:
 *          tags: [Basket]
 */
router.put('/',
  passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    
    try {

        let findedBasket = await Basket.findOne({
            user: req.user.id
        });

        if(!findedBasket) {
            const newBasket = new Basket({
                user: req.user.id
            });

            await newBasket.save(); 
            
            findedBasket = await Basket.findOne({
                user: req.user.id
            });
        }

        const findedDish = findedBasket.shopItems
            .find(x => x.item == req.body.itemId);

        if (findedDish) {
            return res.status(401).json({error: 'Dish already exist in basket'});
        }

        const updateBasket = {
            item: req.body.itemId,
            count: req.body.count
        };

        await Basket.findOneAndUpdate(
            {user: req.user.id},
            {$push: {shopItems: updateBasket}}
        );

        const basket = await Basket
            .findOne({user: req.user.id})
            .populate({
                path: 'shopItems.item',
                model: 'shopItem'
            });


        const price = basket.shopItems
            .reduce((a, b) => a + b.item.cost * b.count, 0);

        await Basket.findOneAndUpdate(
            {user: req.user.id},
            {price}
        );

        res.status(200).json(basket);

    } catch (err) {
        res.status(401).json({error: 'Error'});
    }
    
});

 /**
 * @swagger
 *
 *  /api/basket/delete:
 *      put:
 *          tags: [Basket]
 */
router.put('/delete',
  passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    
    try {

        const updateBasket = {
            shopItems: req.body.dishes
        };

        await Basket.findOneAndUpdate(
            {user: req.user.id},
            {$set: updateBasket}
        );

        const basket = await Basket
            .findOne({user: req.user.id})
            .populate({
                path: 'shopItems.item',
                model: 'shopItem'
            });


        const price = basket.shopItems
            .reduce((a, b) => a + b.item.cost * b.count, 0);

        await Basket.findOneAndUpdate(
            {user: req.user.id},
            {price}
        );

        res.status(200).json({});

    } catch (err) {
        res.status(401).json({error: 'Error'});
    }
    
});


/**
 * @swagger
 *
 *  /api/basket/:
 *      get:
 *          tags: [Basket]
 */
router.get('/',
  passport.authenticate('jwt', {session: false}),
  async(req, res) => {

    try {

        const basket = await Basket.findOne({user: req.user.id})
            .populate({
                path: 'shopItems.item',
                model: 'shopItem'
            });

        res.status(200).json(basket);

    } catch (err) {
        res.status(401).json({error: 'Error'});
    }

});

module.exports = router;