const express = require('express');
const passport = require('passport');

const ShopItem = require('../../models/dbModels/ShopItem');
const Work = require('../../models/dbModels/Work');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ManagerPage
*/

/**
 * @swagger
 *
 *  /api/manager/shop:
 *      get:
 *          tags: [ManagerPage]
 */
router.get('/shop', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { id } = req.user;

  ShopItem.find({ user: id })
  .populate('user', ['name', 'avatar'])
  .then(shopItem => res.status(200).json(shopItem))
});

/**
 * @swagger
 *
 *  /api/manager/work:
 *      get:
 *          tags: [ManagerPage]
 */
router.get('/work', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { id } = req.user;

  Work.find({ user: id })
  .populate('user', ['name', 'avatar'])
  .then(work => res.status(200).json(work))
})

module.exports = router;
