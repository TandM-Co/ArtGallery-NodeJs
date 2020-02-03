const express = require('express');
const router = express.Router();

const User = require('../../models/dbModels/User');
const ShopItem = require('../../models/dbModels/ShopItem');
const News = require('../../models/dbModels/News');
const UserWork = require('../../models/dbModels/UserWork');
const Work = require('../../models/dbModels/Work');

/**
 * @swagger
 * tags:
 *   name: Search
*/

/**
 * @swagger
 *
 *  /api/search/:
 *      get:
 *          tags: [Search]
 */
router.get('/', async (req, res) => {
    const searchValue = req.query ? req.query.value : ''

    const users = await User.find({
        name: {$regex: searchValue}
    });

    const shopItem = await ShopItem.find({
        title: {$regex: searchValue}
    });

    const news = await News.find({
        title: {$regex: searchValue}
    });

    const userWork = await UserWork.find({
        title: {$regex: searchValue}
    });

    const work = await Work.find({
        title: {$regex: searchValue}
    });

    res.status(200).json({
        users,
        shopItem,
        news,
        userWork,
        work
    });
});

module.exports = router;