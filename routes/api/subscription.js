const express = require('express');
const passport = require('passport');
ObjectId = require('mongodb').ObjectID;

const router = express.Router();

const Subscription = require('../../dbSchemas/dbModels/Subscription');
const Gallery = require('../../dbSchemas/dbModels/UserWork');

/**
 * @swagger
 * tags:
 *   name: Subscription
*/

/**
 * @swagger
 *
 *  /api/subscription/:
 *      post:
 *          tags: [Subscription]
 */
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const { id } = req.user;
  const { subscribeUser } = req.body;

  const subscribes = await Subscription.find({user: id})
    .populate('subscribeUser');

  const subscribeUserId = subscribes.map(sub => sub.subscribeUser.id)

  if (subscribeUserId.includes(subscribeUser)) {
    await Subscription.findOneAndRemove({
      user: id,
      subscribeUser: subscribeUser,
    });
    return res.status(200).json({message: 'Successfully unsubscribed'})
  };

  const newSubscription = new Subscription({
    user: id,
    subscribeUser
  });
  
  await newSubscription.save();

  res.status(200).json({message: 'Successfully subscribed'});
});

/**
 * @swagger
 *
 *  /api/subscription/:
 *      get:
 *          tags: [Subscription]
 */
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const { id } = req.user;

  const subscribes = await Subscription.find({user: id});

  const subscribeUserId = subscribes.map(sub => sub.subscribeUser);

  const subscribUserGalery = await Gallery
    .find({user: {$in: subscribeUserId}})
    .populate('user')
    .sort('-date')
    .limit(10);

  res.status(200).json(subscribUserGalery);
});

module.exports = router;
