var express = require('express');
var router = express.Router();
var User = require('../model/User')
const {body, validationResult} = require('express-validator')

router.use('*', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/user')
    }
    next();
});

router.get('/', (req, res, next) => {
    res.render('pages/account/signup')
});

router.post('/', 
    body('username').trim().notEmpty(),
    body('email').trim().isEmail(),
    body('password').isLength({ min: 6 }),
    body('password_confirm').notEmpty(),
    async (req, res, next) => {
        const errors = validationResult(req)

        let errorMsg = ""

        if (!errors.isEmpty()) {
            if(errors.errors[0].path === 'email') {
                errorMsg = "Invalid email"
            } else if(errors.errors[0].path === 'password') {
                errorMsg = "Password must be at least 6 characters long"
            } else {
                errorMsg = `${errors.errors[0].path} invalid`
            }
        } else if(req.body.password.trim() != req.body.password_confirm.trim()) {
            errorMsg = "Passwords do not match"
        } else {
            try {
                const user = await User.create(req.body);
                console.log(`Successfully created account "${user.username}"`)
    
                req.session.loggedin = true
                req.session.user = user;
    
                res.redirect('/user')
            } catch (err) {
                errorMsg = (err.message === "Validation error") ? "Username already taken." : "Something went wrong. Please try again later.";
            }
        }

        console.error(`Could not create account "${req.body.username}": ${errorMsg}`)
        res.render('pages/account/signup', { msg: errorMsg })
});

module.exports = router;