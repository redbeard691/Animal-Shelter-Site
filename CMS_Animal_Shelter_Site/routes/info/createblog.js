const express = require('express');
const router = express.Router();
const SiteBlogs = require('../../model/SiteBlogs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs


/* GET blog listing page. */
router.get('/', function(req, res, next) {
  res.render('pages/info/createblog'); // Assuming your updated HTML is in blog.ejs
});

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

// Route to handle the submission of the new blog post form
router.post('/create', upload.single('featuredImage'), async (req, res) => {
    try {
        const { title, author, content } = req.body;
        let featuredImage = null;

        if (req.file) {
            featuredImage = '/images/blog_uploads/' + req.file.filename; // Store the file path
        }

        // Basic validation
        if (!title || !author || !content) {
            return res.status(400).send('Title, author, and content are required.');
        }

        const slug = generateSlug(title); // Generate slug from title

        const newBlog = await SiteBlogs.create({
            title,
            author,
            slug, // Save the generated slug
            content,
            featuredImage,
        });

        console.log('New blog post created:', newBlog);
        res.redirect('/pages/info/blog'); // Redirect to the blog list page
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Error creating blog post.');
    }
});

module.exports = router;