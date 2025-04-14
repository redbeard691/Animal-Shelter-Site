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
    res.render('pages/account/signup')
});

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        console.log(`Successfully created account "${user.username}"`)

        req.session.loggedin = true
        req.session.user = user;

        res.redirect('/user')
    } catch (err) {
        const msg = (err.message === "Validation error") ? "Username already taken." : "Something went wrong. Please try again later.";

        console.error(`Could not create account "${req.body.username}": ${err}`)
        res.render('pages/account/signup', { msg: msg })
    }
});

module.exports = router;