var express = require('express');
var router = express.Router();
const SiteBlogs = require('../../model/SiteBlogs'); // Adjust the path if needed

/* GET a single blog post by slug. */
router.get('/:slug', async (req, res, next) => {
    const { slug } = req.params;
    console.log(req.params);
    try {
        const blog = await SiteBlogs.findOne({ where: { slug: slug } });
        
        if (blog) {
            res.render('pages/info/viewblog', { blog: blog }); // Create a new view file: viewBlog.ejs
        } else {
            res.status(404).send('Blog post not found.');
        }
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).send('Server error fetching blog post.');
    }
});

module.exports = router;