var express = require('express');
var router = express.Router();
var b = require('../model/Bulletin');

router.get('/', (req, res, next) => {
    res.render('pages/info/bulletins')
})

router.get('/search', async (req, res, next) => {
    try {
        console.log(req.query)

        const posts = await b.findAll(
            {
                where: req.query,
                order: [
                    [ "date", "DESC" ]
                ]
            },
            {
                include: [Tag]
            }
        )

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(posts));
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error.")
    }
})

module.exports = router;
