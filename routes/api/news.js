const express = require('express');
const passport = require('passport');

const router = express.Router();

const News = require('../../models/dbModels/News');
const Comment = require('../../models/dbModels/Comment');

/**
 * @swagger
 * tags:
 *   name: News
*/

/**
 * @swagger
 *
 *  /api/news/:
 *      post:
 *          tags: [News]
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const newNews = new News({
        title: req.body.title,
        text: req.body.text,
        image: req.body.image,
        category: req.body.category,
        author: req.body.author,
        shortText: req.body.shortText,
        imageList: req.body.imageList,
        video: req.body.video
    });
    newNews.save().then(news => res.status(200).json(news))
});

/**
 * @swagger
 *
 *  /api/news/item/:news_id:
 *      get:
 *          tags: [News]
 */
router.get('/item/:news_id', (req, res) => {
    News.findOne({_id: req.params.news_id})
        .then(news => res.status(200).json(news))
});

/**
 * @swagger
 *
 *  /api/news/item/:news_id:
 *      post:
 *          tags: [News]
 */
router.post('/item/:news_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const comment = new Comment({
        user: req.body.user,
        news: req.params.news_id,
        text: req.body.comment
    })
    comment.save().then(comment => res.json(comment))
});

/**
 * @swagger
 *
 *  /api/news/item/comment/:news_id:
 *      get:
 *          tags: [News]
 */
router.get('/item/comment/:news_id', (req, res) => {
    Comment.find({news: req.params.news_id})
        .sort('-date')
        .populate('user', ['name', 'avatar', '_id'])
        .then(comment => res.status(200).json(comment))
});

/**
 * @swagger
 *
 *  /api/news/item/comment/:news_id:
 *      post:
 *          tags: [News]
 */
router.post('/item/comment/:news_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    comment = {
        like: req.body.idUser
    }

    Comment.findOne({_id : req.body.id, like: {$all: req.body.idUser}})
        .then(vul => {
            if(vul){
                Comment.findOneAndUpdate(
                    {_id : req.body.id},
                    {$pull: comment},

                ).then(v => res.status(200).json('done'))
            } else {
                Comment.findOneAndUpdate(
                    {_id : req.body.id},
                    {$push: comment}
                ).then(v => res.status(200).json('done'))
            }
        }
    )
});

/**
 * @swagger
 *
 *  /api/news/music:
 *      get:
 *          tags: [News]
 */
router.get('/music', (req, res) => {
    News.find({category: 'music'})
        .sort('-date')
        .then(vul => res.json(vul))
});

/**
 * @swagger
 *
 *  /api/news/art:
 *      get:
 *          tags: [News]
 */
router.get('/art', (req, res) => {
    News.find({category: 'art'})
        .sort('-date')
        .then(vul => res.json(vul))
});

/**
 * @swagger
 *
 *  /api/news/film:
 *      get:
 *          tags: [News]
 */
router.get('/film', (req, res) => {
    News.find({category: 'film'})
        .sort('-date')
        .then(vul => res.json(vul))
});

/**
 * @swagger
 *
 *  /api/news/mainnews:
 *      get:
 *          tags: [News]
 */
router.get('/mainnews', (req, res) => {
    News.find({category: 'mainNews'})
        .sort('-date')
        .limit(4)
        .then(vul => res.json(vul))
});


module.exports = router;
