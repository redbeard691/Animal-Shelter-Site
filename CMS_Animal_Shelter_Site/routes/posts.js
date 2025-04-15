var express = require('express');
var router = express.Router();
var { Post, Tag } = require('../model/Post')
var User = require('../model/User')
const { Op } = require("sequelize");
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
    res.render('pages/posts/listings')
})

router.get('/search', async (req, res, next) => {
    try {
        console.log(req.query)

        const query = {}
        for (const param in req.query) {
            console.log(param)
            if (param !== "Tag") {
                query[param] = req.query[param]
            }
        }

        let result = []

        if (req.query.Tag){
            const tags = req.query.Tag.split(',')

            const posts = await Post.findAll(
                {
                    where: query,
                    order: [
                        [ "updatedAt", "DESC" ]
                    ],
                    include: [
                    {
                        model: Tag,
                        where: {
                            name: { [Op.in]: tags }
                        }
                    },
                    { model: User }
                  ]
                }
              )
            
            for (const post of posts) {
                if (post.Tags && post.Tags.length === tags.length){
                    result.push(post)
                }
            }
        } else {
            result = await Post.findAll(
                {
                    where: query,
                    order: [
                        [ "updatedAt", "DESC" ]
                    ],
                    include: [Tag, User]
                }
            )
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error.")
    }
})

router.get('/view/:postId', async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.postId, {
            include: [Tag, User]
        })
        
        if (post) {
            res.locals.post = post
            res.render('pages/posts/view')
        } else {
            res.status(404).send("Requested post could not be found.")
        }
    } catch (error) {
        res.status(500).send("Server error. Try again later.")   
    }
})

// -= Authenticated user actions =-

router.use('*', (req, res, next) => {
    if (req.session.loggedin){
        next()
    } else {
        res.redirect('/login')
    }
})

router.get('/create', (req, res, next) => {
    res.render('pages/posts/create')
})

router.post('/create', upload.single('picture'), async (req, res, next) => {
    // Parse tags
    const tags = []
    if (req.body.tags) {
        const inputTags = req.body.tags.split(',')
        for (let i = 0; i < inputTags.length; i++) {
            const tag = { name: inputTags[i] }
            tags.push(tag)
        }
    }

    // Create post
    const post = await Post.create({
        author: req.session.user.username,
        status: req.body.status,
        name: req.body.name,
        type: req.body.type,
        city: req.body.city,
        state: req.body.state,
        picture: (req.file && req.file.filename) ? path.join("uploads", req.file.filename) : "",
        description: req.body.description,
        Tags: tags
    },
    {
        include: [Tag]
    })

    // Redirect to newly created post page
    res.redirect(`/posts/view/${post.id}`)
})

router.get('/edit/:postId', async (req, res, next) => {
    const post = await Post.findByPk(req.params.postId)

    if (post.author != req.session.user.username) {
        res.status(403).send("Account does not have access to this resource.")
    }

    res.locals.post = post
    res.render('pages/posts/edit')
})

router.post('/edit/:postId', async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.postId)

        if (post.author != req.session.user.username) {
            res.status(403).send("Account does not have access to this resource.")
        }

        // Parse tags
        const inputTags = req.body.tags.split(',')
        const tags = []

        for (let i = 0; i < inputTags.length; i++) {
            const tag = { name: inputTags[i] }
            tags.push(tag)
        }

        await post.update({
            author: req.session.user.username,
            status: req.body.status,
            name: req.body.name,
            type: req.body.type,
            city: req.body.city,
            state: req.body.state,
            description: req.body.description,
            Tags: tags
        },
        {
            include: [Tag]
        })

        res.redirect(`/posts/view/${req.params.postId}`)
    } catch (error) {
        res.status(500).send("Server error")
    }
})

module.exports = router;