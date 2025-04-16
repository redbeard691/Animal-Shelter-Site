var express = require('express');
var router = express.Router();
const SiteBlogs =  require('../../model/SiteBlogs');

router.post('/:slug', async function(req, res, next) {
    console.log("Attempting to delete blog post")
    if (res.locals.loggedin && res.locals.currentuser.isadmin) {
        try {
            const blog = await SiteBlogs.findOne({ where: { slug: req.params.slug } })
            await blog.destroy()

            res.redirect('/pages/info/blog')
        } catch (error) {
            console.log(error)
            res.status(500).send("Server error")
        }
    } else {
        res.redirect('/login')
    }
});
  

module.exports = router;