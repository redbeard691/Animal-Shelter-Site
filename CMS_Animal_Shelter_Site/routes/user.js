var express = require('express');
var router = express.Router();
var User = require('../model/User')
var Shelter = require('../model/Shelter')
const multer  = require('multer')
const path = require('path');

// Image uploading code
const myStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/uploads'));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: myStorage })


router.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect(`/user/profile/${req.session.user.username}`)
    } else {
        res.redirect('/login')
    }
});

router.get('/settings', (req, res, next) => {
    if (req.session.loggedin) {
        res.render('pages/account/settings')
    } else {
        res.redirect('/login')
    }
});

router.post('/settings', upload.single('avatar'), async (req, res, next) => {
    // TODO: Ensure the user is editing their own settings.
    if (req.session.loggedin) {
        // Need to get instance directly from db in order to update it.
        // Can't just use the user stored in the session.
        const user = await User.findByPk(req.session.user.username, {
            include: [Shelter]
        })

        // Update user info
        if (req.body.new_email) {
            user.email = req.body.new_email
        }
        if (req.body.new_password) {
            user.password = req.body.new_password
        }
        // TODO: Set profile pic. Also update ejs template to display image.

        // Update shelter info
        if (user.isshelter){
            if (req.body.new_address) {
                user.Shelter.address = req.body.new_address
            }
            if (req.body.new_animals) {
                user.Shelter.animals = req.body.new_animals
            }
            if (req.body.new_about) {
                user.Shelter.about = req.body.new_about
            }
            if (req.body.new_website) {
                user.Shelter.website = req.body.new_website
            }
            await user.Shelter.save()
        }

        if (req.file && req.file.filename){
            user.profilePic = path.join("uploads", req.file.filename)
        }

        await user.save()

        req.session.user = user

        res.redirect('/user')
    } else {
        res.redirect('/login')
    }
})

//allows the user to upload a file for their profile picture.
router.post('/profilePic', upload.single('avatar'), function (req, res, next) {})

router.get('/profile/:username', async (req, res, next) => {
    const user = await User.findByPk(req.params.username, {
        include: [Shelter]
    })
    if (user) {
        if (user.isshelter){
            res.render('pages/account/shelterprofile', { user: user })
        } else {
            res.render('pages/account/profile', { user: user })
        }
    } else {
        // TODO: Is there a better way to do this?
        res.redirect('/404')
    }
})

module.exports = router;