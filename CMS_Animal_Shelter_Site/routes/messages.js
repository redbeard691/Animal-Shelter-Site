var express = require('express');
var router = express.Router();
var Message = require('../model/Message');
var User = require('../model/User');

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

/* Functions to report users and posts to admin via message*/
router.post('/report-admin', async (req, res) => {
    if (req.session.loggedin && req.session.user) {
        const { reportType, contentId, reason } = req.body;

        try {
            // Find the admin user (you might have a specific way to identify them)
            // Maybe implement later to send to all users or different implementation.
            const adminUser = await User.findOne({ where: { isadmin: true } });

            if (adminUser) {
                await Message.create({
                    sender: req.session.user.username,
                    recipient: adminUser.username,
                    subject: `Report: ${reportType} ${contentId}`,
                    contents: `Reason: ${reason}\n\nReported ${reportType} ID: ${contentId}`
                });

                console.log(`Report sent to admin by ${req.session.user.username} for ${reportType} ${contentId}`);
                return res.json({ success: true, message: 'Report sent successfully.' });
            } else {
                console.error('Admin user not found.');
                return res.status(500).json({ success: false, error: 'Could not find an administrator to send the report to.' });
            }

        } catch (error) {
            console.error('Error sending report message:', error);
            return res.status(500).json({ success: false, error: 'Failed to send report.' });
        }
    } else {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }
});

/* Reporting inbox message to admin */
router.post('/report-message-admin', async (req, res) => {
    if (req.session.loggedin && req.session.user) {
        const { messageId, reason } = req.body;

        try {
            const originalMessage = await Message.findByPk(messageId);
            const adminUser = await User.findOne({ where: { isadmin: true } });

            if (!originalMessage) {
                return res.status(404).json({ success: false, error: 'Original message not found.' });
            }

            if (!adminUser) {
                return res.status(500).json({ success: false, error: 'Admin user not found.' });
            }

            await Message.create({
                sender: req.session.user.username,
                recipient: adminUser.username,
                subject: `Reported Message: ${originalMessage.subject}`,
                contents: `The following message (ID: ${originalMessage.id}) has been reported by ${req.session.user.username} for the following reason:\n\n${reason}\n\n--- Original Message ---\nFrom: ${originalMessage.sender}\nSubject: ${originalMessage.subject}\nContents: ${originalMessage.contents}`
            });

            console.log(`Message ID ${messageId} reported to admin by ${req.session.user.username}`);
            return res.json({ success: true, message: 'Message reported successfully.' });

        } catch (error) {
            console.error('Error reporting message to admin:', error);
            return res.status(500).json({ success: false, error: 'Failed to report message.' });
        }
    } else {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }
});


module.exports = router;