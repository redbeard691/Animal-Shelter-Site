var express = require('express');
var router = express.Router();
var b = require('../../model/Bulletin');
const Bulletin = require('../../model/Bulletin');

router.get('/', (req, res, next) => {
    res.render('pages/info/bulletins')
})

router.get('/view/:id', async (req, res, next) => {
    try {
        const bulletin = await Bulletin.findByPk(req.params.id)
        res.locals.bulletin = bulletin
        res.render('pages/info/viewbulletin')
    } catch (error) {
        console.log(error)
        res.status(500).send("Server error")
    }
})

router.get('/search', async (req, res, next) => {
    try {
        const posts = await b.findAll(
            {
                where: req.query,
                order: [
                    [ "date", "DESC" ]
                ]
            }
        )

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(posts));
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error.")
    }
})

// -= Authenticated user actions =-

router.use('*', (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        res.redirect('/login')
    }
})

router.get('/create', (req, res, next) => {
    if (res.locals.currentuser.isshelter) {
        res.render('pages/info/createbulletin')
    } else {
        res.status(403).send("Invalid access to bulletin creation page.")
    }
})

router.post('/create', async (req, res, next) => {
    console.log(req.body)
    if (res.locals.currentuser.isshelter) {
        try {
            const bulletin = await Bulletin.create(req.body)
            res.redirect(`/pages/info/bulletins/view/${bulletin.id}`)
        } catch (error) {
            console.log(error)
            res.status(500).send("Server error.")
        }
    } else {
        res.status(403).send("Invalid access to bulletin creation page.")
    }
})

router.get('/edit/:id', async (req, res, next) => {
    if (res.locals.currentuser.isshelter) {
        try {
            const bulletin = await Bulletin.findByPk(req.params.id)
            res.locals.bulletin = bulletin
            res.render('pages/info/editbulletin')
        } catch (error) {
            console.error(error)
            res.status(500).send("Server error.")
        }
    } else {
        res.status(403).send("Invalid access to bulletin edit page.")
    }
})

router.post('/edit/:id', async (req, res, next) => {
    if (res.locals.currentuser.isshelter) {
        try {
            const bulletin = await Bulletin.findByPk(req.params.id)
            await bulletin.update(req.body)
            res.redirect(`/pages/info/bulletins/view/${bulletin.id}`)
        } catch (error) {
            console.error(error)
            res.status(500).send("Server error.")
        }
    } else {
        res.status(403).send("Invalid access to bulletin edit page.")
    }
})

router.post('/delete/:id', async (req, res, next) => {
    if (res.locals.currentuser.isshelter) {
        try {
            const bulletin = await Bulletin.findByPk(req.params.id)
            await bulletin.destroy()
            res.redirect(`/pages/info/bulletins/`)
        } catch (error) {
            console.error(error)
            res.status(500).send("Server error.")
        }
    } else {
        res.status(403).send("Invalid access to bulletin deletion.")
    }
})

module.exports = router;
