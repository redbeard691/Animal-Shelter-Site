var express = require('express');
const { locals } = require('../../app');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pages/account/profile');
  console.log("==========");
  console.log(req.session);
});

module.exports = router;