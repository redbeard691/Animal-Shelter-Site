var express = require('express');
var User = require('../../model/User')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Pass 'msg' with a default value (e.g., undefined or null)
  res.render('pages/account/login',{ msg: undefined });
});

router.post('/login', async function(req, res, next) {
  console.log(("UserINFO HERE!!!!!!!!"))
  console.log(req.body.username+" - "+req.body.password);
  const user = await User.findUser(req.body.username, req.body.password)
  if(user!== null){
    console.log("passed login!");

    req.session.loggedin = true

    req.session.user = user;
    //res.redirect("/pages/account/profile");
    res.redirect("/");
  }else{
    console.log("failed login");
    res.render('pages/account/login', {msg: "login failed, try again"});
  }
});

module.exports = router;