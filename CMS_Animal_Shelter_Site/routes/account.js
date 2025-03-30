var express = require('express');
var router = express.Router();
var User = require('../model/User')

/* Authenticated user actions. If user is not authenticated, redirects to login page. */

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
    });

    res.redirect('/account/login');
});

router.get('/profile', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect(`/account/profile/${req.session.user.username}`)
    } else {
        res.redirect('/account/login')
    }
});

router.get('/profile/:username', (req, res, next) => {
    res.render('pages/account/profile')
})

router.get('/settings', (req, res, next) => {
    if (req.session.loggedin) {
        res.render('pages/account/settings')
    } else {
        res.redirect('/account/login')
    }
});


/* Unauthenticated user actions. If user is already logged in, redirect to profile page. */

router.use('*', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/account/profile')
    }
    next();
});

router.get('/', (req, res, next) => {
    res.redirect('/account/login')
});

router.get('/login', (req, res, next) => {
    res.render('pages/account/login')
});

router.post('/login', async (req, res, next) => {
    const user = await User.findUser(req.body.username, req.body.password)
    
    if(user!== null){
        console.log(`Login successful for account ${user.username}`);

        req.session.loggedin = true
        req.session.user = user;

        res.redirect("/account/profile");
    } else {
        console.log(`Login failed for account ${req.body.username}`);
        res.render('pages/account/login', {msg: "Invalid username or password."});
    }
});

router.get('/signup', (req, res, next) => {
    res.render('pages/account/signup')
});

router.post('/signup', (req, res, next) => {
    // Attempt to create a new user with the provided information.
    // If successful, create session & redirect to profile page.
    // Otherwise, redirect to signup page with error message.
});



module.exports = router;