var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pages/posts/demo_listings');
});

module.exports = router;