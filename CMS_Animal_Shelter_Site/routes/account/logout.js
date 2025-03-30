const express = require('express');
const router = express.Router();

router.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.redirect('/login'); // Or an error page
    } else {
      res.redirect('/login'); // Redirect to the login page after logout
    }
  });
});

module.exports = router;