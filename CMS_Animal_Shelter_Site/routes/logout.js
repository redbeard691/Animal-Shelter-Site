var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
    });

    res.redirect('/login');
});

module.exports = router;