const express = require('express');
const router = express.Router();
const SiteBlogs = require('../../model/SiteBlogs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/blog_uploads/'); // Store images in this directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + uuidv4(); // Use uuidv4()
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname); // Rename the file
    },
});

const upload = multer({ storage: storage });

// Function to generate a slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-') // Replace non-alphanumeric with dashes
        .replace(/^-+|-+$/g, '')    // Remove leading/trailing dashes
        .replace(/-{2,}/g, '-');       // Replace multiple dashes with single dash
}



/* GET blog listing page. */
router.get('/:slug', async function(req, res, next) {
    try {
        const blog = await SiteBlogs.findOne({ where: { slug: req.params.slug } });
        res.locals.blog = blog
        res.render('pages/info/editblog')
    } catch (error) {
        console.log(`Could not edit blog post "${req.params.slug}": ${error}`)
        res.status(500).send("Server error")
    }
});

// Route to handle the submission of the new blog post form
router.post('/:slug', upload.single('featuredImage'), async (req, res) => {
    try {
        const { title, author, content } = req.body;
        let featuredImage = null;

        console.log(`Updating blog post: ${req.params.slug}`)

        // Basic validation
        if (!title || !author || !content) {
            return res.status(400).send('Title, author, and content are required.');
        }

        const blog = await SiteBlogs.findOne({ where: { slug: req.params.slug } });

        console.log(`Found old blog post: ${blog.slug}`)

        await blog.update({
            title: title,
            author: author,
            content: content
        });

        console.log(`Updated blog post: ${blog.slug}`)

        if (req.file && req.file.filename) {
            featuredImage = '/images/blog_uploads/' + req.file.filename; // Store the file path
            await blog.update({ featuredImage: featuredImage })
        }

        console.log('Updated blog post:', blog);
        res.redirect('/pages/info/blog'); // Redirect to the blog list page
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send('Error updating blog post.');
    }
});

module.exports = router;