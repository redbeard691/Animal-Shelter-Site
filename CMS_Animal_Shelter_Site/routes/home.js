var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/home', function(req, res, next) {
  res.render('home', {title: "Home"});
});

module.exports = router;