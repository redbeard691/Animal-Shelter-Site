var express = require('express');
var router = express.Router();
const SiteBlogs =  require('../../model/SiteBlogs');

/* GET blog listing page. */
router.get('/', function(req, res, next) {
  res.render('pages/info/blog'); // Assuming your updated HTML is in blog.ejs
});

/* GET all blog data as JSON. */
router.get('/data', async (req, res, next) => {
  try {
    const blogs = await SiteBlogs.findAll({
      order: [['createdAt', 'DESC']] // Optional: Order by creation date
    });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Server error fetching blog data.');
  }
});

module.exports = router;