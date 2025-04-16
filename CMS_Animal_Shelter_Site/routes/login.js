var express = require('express');
var router = express.Router();
var User = require('../model/User')

router.use('*', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/user')
    }
    next();
});

router.get('/', (req, res, next) => {
    res.render('pages/account/login')
});

router.post('/', async (req, res, next) => {
    const user = await User.authenticateUser(req.body.username, req.body.password)

    if (user !== null) {
        if (user.isbanned === false) {
            console.log(`Login successful for account "${user.username}"`);

            req.session.loggedin = true;
            req.session.user = user;

            res.redirect("/user");
        }
        else {
            console.log(`Attempted login from banned account: "${req.body.username}"`);
            res.render('pages/account/login', { msg: "User Account is Banned" });
        }
    } else {
        console.log(`Login failed for account "${req.body.username}"`);
        res.render('pages/account/login', { msg: "Invalid username or password." });
    }
});

module.exports = router;