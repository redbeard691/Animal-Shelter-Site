var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/template/header', function(req, res, next) {
  res.render('template/header');
});

module.exports = router;