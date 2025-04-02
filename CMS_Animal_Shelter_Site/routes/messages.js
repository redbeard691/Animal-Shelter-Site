var express = require('express');
var router = express.Router();
var Message = require('../model/Message')


router.get('/compose', (req, res, next) => {
    if (req.session.loggedin) {
        if (req.query.recipient) {
            res.locals.recipient = req.query.recipient
        }
        
        res.render('pages/messages/compose')
    } else {
        res.redirect('/account/login')
    }
})

router.post('/compose', async (req, res, next) => {
    if (req.session.loggedin) {
        let success = false
        let result = ""

        try {
            await Message.create({
                sender: req.session.user.username,
                recipient: req.body.recipient,
                subject: req.body.subject,
                contents: req.body.contents
            })

            success = true
            result= "Message sent successfully!"
        } catch (error) {
            success = false
            result = `Message could not be sent: ${error.message}`
        }
        
        res.redirect('/messages/inbox')
    } else {
        res.redirect('/account/login')
    }
})

router.get('/inbox', async (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.messages = await Message.findAll({
            where: { recipient: req.session.user.username }
        })

        res.render('pages/messages/inbox')
    } else {
        res.redirect('/account/login')
    }
})

router.get('/:messageId', async (req, res, next) => {
    if (req.session.loggedin) {
        const message = await Message.findByPk(req.params.messageId)

        if (message.recipient === req.session.user.username) {
            res.send(message)
        } else {
            res.status(403).send('You do not have permission to view this content.')
        }
    } else {
        res.status(401).send('You must be authenticated to access this content.')
    }
}) 


module.exports = router;