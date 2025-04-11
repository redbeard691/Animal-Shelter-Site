var express = require('express');
var router = express.Router();
var User = require('../model/User');

/* Admin Middleware */
function isAdmin(req, res, next) {
    console.log('Checking isAdmin func (Admin Router)');
    console.log(req.session)
    console.log(req.session.user)
    if (req.session.user && req.session.user.isadmin) {
        console.log('passed isAdmin (Admin Router)');
        return next();
    }
    return res.status(403).json({ success: false, error: 'Unauthorized' }); // Send JSON for API
}

/* Admin Routes */
router.post('/ban-user', isAdmin, async (req, res) => {
    console.log('Handling /admin/ban-user POST request');
    const { username } = req.body;

    try {
        const userToBan = await User.findOne({ where: { username: username } });
        if (!userToBan) {
            console.log('User not found:', username);
            return res.json({ success: false, error: 'User not found.' });
        }
        await User.update({ isbanned: true }, {
            where: { username: username }
        });
        console.log('User banned successfully:', username);
        res.json({ success: true });
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ success: false, error: 'Failed to ban user.' });
    }
});

// Add other admin-related routes here

module.exports = router;