var express = require('express');
var router = express.Router();
var User = require('../model/User')

router.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect(`/user/${req.session.user.username}`)
    } else {
        res.redirect('/login')
    }
});

router.get('/:username', async (req, res, next) => {
    const user = await User.findByPk(req.params.username)
    if (user) {
        res.render('pages/account/profile', { user: user })
    } else {
        // TODO: Is there a better way to do this?
        res.redirect('/404')
    }
})

router.get('/settings', (req, res, next) => {
    if (req.session.loggedin) {
        res.render('pages/account/settings')
    } else {
        res.redirect('/login')
    }
});

router.post('/settings', async (req, res, next) => {
    // TODO: Ensure the user is editing their own settings.
    if (req.session.loggedin) {
        // Need to get instance directly from db in order to update it.
        // Can't just use the user stored in the session.
        const user = await User.findByPk(req.session.user.username)

        // TODO: Set profile pic. Also update ejs template to display image.
        if (req.body.new_email) {
            user.email = req.body.new_email
        }
        if (req.body.new_password) {
            user.password = req.body.new_password
        }
        await user.save()

        req.session.user = user

        res.redirect('/user')
    } else {
        res.redirect('/login')
    }
})

module.exports = router;