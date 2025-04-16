var express = require('express');
var router = express.Router();
const SiteBlogs  = require('../model/SiteBlogs');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
      // Fetch the 3 newest blog posts, ordered by creation date
      const recentBlogs = await SiteBlogs.findAll({
          order: [['createdAt', 'DESC']], // Order by createdAt in descending order (newest first)
          limit: 3, // Limit the result to 3 posts
      });

      // Render the index page and pass the blog data to the template
      res.render('index', { recentBlogs }); // 'index' is the name of your EJS file
  } catch (error) {
      console.error('Error fetching recent blogs:', error);
      // Handle the error appropriately, e.g., show an error page to the user
      res.status(500).send('Internal Server Error'); // Or render an error page: res.render('error', { message: 'Failed to load blogs' });
  }
});

module.exports = router;
