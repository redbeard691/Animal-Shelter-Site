var express = require('express');
var router = express.Router();
var b = require('../model/Bulletin');

router.get('/', (req, res, next) => {
    res.render('pages/info/bulletins')
})