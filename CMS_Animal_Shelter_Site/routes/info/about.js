var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/pages/info/about', function(req, res, next) {
  res.render('pages/info/about');
});

module.exports = router;