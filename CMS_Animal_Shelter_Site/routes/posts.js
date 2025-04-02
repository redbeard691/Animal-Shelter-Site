var express = require('express');
var router = express.Router();
var { Post, Tag } = require('../model/Post')

router.get('/', (req, res, next) => {
    res.render('pages/posts/listings')
})

router.get('/create', (req, res, next) => {
    if (req.session.loggedin) {
        res.render('pages/posts/create')
    } else {
        res.redirect('/account/login')
    }
})

router.post('/create', async (req, res, next) => {
    if (req.session.loggedin) {
        
        // Parse tags
        const inputTags = req.body.tags.split(',')
        const tags = []

        for (let i = 0; i < inputTags.length; i++) {
            const tag = { name: inputTags[i] }
            tags.push(tag)
        }

        // Create post
        const post = await Post.create({
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

        // Redirect to newly created post page
        res.redirect(`/posts/${post.id}`)
    } else {
        res.redirect('/account/login')
    }
})

router.get('/:postId', async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.postId)
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

router.get('/:postId/edit', async (req, res, next) => {
    if (req.session.loggedin){
        const post = await Post.findByPk(req.params.postId)

        if (post.author != req.session.user.username) {
            res.status(403).send("Account does not have access to this resource.")
        }

        res.locals.post = post
        res.render('pages/posts/edit')
    } else {
        res.redirect('/account/login')
    }
})

router.post('/:postId/edit', async (req, res, next) => {
    if (req.session.loggedin){
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

            post.status= req.body.status
            post.name= req.body.name
            post.type= req.body.type
            post.city= req.body.city
            post.state= req.body.state
            post.description= req.body.description
            post.Tags= tags

            post.save()

            res.redirect(`/posts/${req.params.postId}`)
        } catch (error) {
            res.status(500).send("Server error")
        }
    } else {
        res.redirect('/account/login')
    }
})

module.exports = router;