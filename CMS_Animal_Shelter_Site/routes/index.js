var express = require('express');
var router = express.Router();
var { Post } = require('../model/Post')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const lostPosts = await Post.findAll(
    {
        where: {
          status: "Lost"
        },
        order: [
            [ "createdAt", "DESC" ]
        ]
    }
  )

  const foundPosts = await Post.findAll(
    {
        where: {
          status: "Found"
        },
        order: [
            [ "createdAt", "DESC" ]
        ]
    }
  )

  // TODO: Query bulletins

  res.locals.lostPosts = lostPosts
  res.locals.foundPosts = foundPosts
  res.render('index');
});

module.exports = router;
