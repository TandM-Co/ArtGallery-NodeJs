const express = require('express');
const passport = require('passport');

const Order = require('../../models/dbModels/Order');
const Basket = require('../../models/dbModels/Basket');
const router = express.Router();
const transporter = require('../../mail/nodemailer');
const ShopSchema = require('../../models/dbModels/ShopItem');

/**
 * @swagger
 * tags:
 *   name: Order
*/

/**
 * @swagger
 *
 *  /api/order/:
 *      post:
 *          tags: [Order]
 */
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const { seller, shopItem } = req.body;
    const customer = req.user.id;

    const newOrder = new Order({
      seller,
      shopItem,
      customer,
    });

    await newOrder.save();

    const findBasket = await Basket
      .findOne({user: customer})
      .populate('shopItems.item');

    const updateBasket = findBasket.shopItems
      .filter((basketItem) => basketItem.item.id !== shopItem);

    await Basket.findOneAndUpdate(
      {user: customer},
      {shopItems: updateBasket}
    );

    const basket = await Basket
      .findOne({user: customer})
      .populate({
          path: 'shopItems.item',
          model: 'shopItem'
      });

    const price = basket.shopItems
      .reduce((a, b) => a + b.item.cost * b.count, 0);

    await Basket.findOneAndUpdate(
      {user: customer},
      {price}
    );

    const item = await ShopSchema.findById(shopItem)
      .populate('user');

    const mailForCustomer = {
      from: '"ArtGallery"',
      to: `${req.user.email}`,
      subject: "Информация о заказе",
      template: 'order',
      context: {
          user: req.user,
          item,
          message: 'Вы заказали'
      }
    };

    const mailForSeller = {
      from: '"ArtGallery"',
      to: `${item.user.email}`,
      subject: "Информация о заказе",
      template: 'order',
      context: {
          user: req.user,
          item,
          message: 'У вас заказали'
      }
    };

    await Promise.all([
      transporter.sendMail(mailForCustomer),
      transporter.sendMail(mailForSeller)
    ]);

    res.status(200).json({message: 'Order was successfully accepted'});
  } catch (err) {
    console.log(err);
  }
});

/**
 * @swagger
 *
 *  /api/order/seller:
 *      get:
 *          tags: [Order]
 */
router.get('/seller', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { id } = req.user;

  Order.find({ seller: id })
    .populate('shopItem')
    .populate('customer')
    .populate('user')
    .then(shopItem => res.status(200).json(shopItem))
});

/**
 * @swagger
 *
 *  /api/order/customer:
 *      get:
 *          tags: [Order]
 */
router.get('/customer', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { id } = req.user;

  Order.find({ customer: id })
    .populate('shopItem')
    .populate('customer')
    .populate('user')
    .then(shopItem => res.status(200).json(shopItem))
});

module.exports = router;
