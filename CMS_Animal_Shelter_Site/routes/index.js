var express = require('express');
var router = express.Router();
const SiteBlogs = require('../model/SiteBlogs');
var { Post } = require('../model/Post');
const Bulletin = require('../model/Bulletin');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const lostPosts = await Post.findAll(
      {
        where: {
          status: "Lost"
        },
        order: [
          ["createdAt", "DESC"]
        ],
        limit: 3
      }
    )

    const foundPosts = await Post.findAll(
      {
        where: {
          status: "Found"
        },
        order: [
          ["createdAt", "DESC"]
        ],
        limit: 3
      }
    )

    const bulletins = await Bulletin.findAll(
      {
        order: [
          ["createdAt", "DESC"]
        ],
        limit: 3
      }
    )

    const blogs = await SiteBlogs.findAll(
      {
        order: [
          ["createdAt", "DESC"]
        ],
        limit: 3
      }
    )

    res.locals.lostPosts = lostPosts
    res.locals.foundPosts = foundPosts
    res.locals.bulletins = bulletins
    res.locals.blogs = blogs
    res.render('index');
  } catch {
    console.error('Error rendering homepage:', error);
    // Handle the error appropriately, e.g., show an error page to the user
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
