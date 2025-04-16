var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const sequelize = require('./db');

// Models
const User = require('./model/User');
const Shelter = require('./model/Shelter');
const Message = require('./model/Message');
const SiteBlogs = require('./model/SiteBlogs');
const { Post, Tag } = require('./model/Post');


// Routes ----------------------------------
var indexRouter = require('./routes/index');
// Info Routes
var blogRouter = require('./routes/info/blog');
var bulletinRouter = require('./routes/info/bulletins');
var viewblogRouter = require('./routes/info/viewblog');
var createblogRouter = require('./routes/info/createblog');
var deleteblogRouter = require('./routes/info/deleteblog');
var editblogRouter = require('./routes/info/editblog')

var aboutRouter = require('./routes/about');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var logoutRouter = require('./routes/logout');
var userRouter = require('./routes/user');
var messageRouter = require('./routes/messages');
var postRouter = require('./routes/posts');
var adminRouter = require('./routes/admin');
var sheltersRouter = require('./routes/shelters');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For Header path
app.locals.includePath = path.join(__dirname, 'views');

// Express-Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'wsu489',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  loggedin: false
}))

// Middleware that allows all templates to access login status & user info.
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin;
  res.locals.currentuser = req.session.user;
  next()
})

// Routers
app.use('/', indexRouter);

// Info
app.use('/pages/info/blog',blogRouter);
app.use('/pages/info/viewblog',viewblogRouter);
app.use('/pages/info/createblog',createblogRouter);
app.use('/pages/info/deleteblog',deleteblogRouter);
app.use('/pages/info/editblog',editblogRouter);
app.use('/pages/info/bulletins',bulletinRouter);

app.use('/about',aboutRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/user', userRouter);
app.use('/messages', messageRouter);
app.use('/posts', postRouter);
app.use('/admin', adminRouter);
app.use('/shelters', sheltersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Setup function for test data.
async function setup() {
  await User.create({ username: "admin", password: "1234", email:"admin@example.com", isadmin: true});
  console.log("Created admin account.")

  await User.create({ username: "test", password: "test", email:"test@example.com"})
  console.log("Created test user account.")
  await User.create({ username: "nick", password: "1234", email:"nick@example.com"})
  console.log("Created test user account.")

  await User.create(
    {
      username: "shelter",
      password: "shelter",
      email:"shelter@example.com",
      isshelter: true,
      Shelter: {
        address: "111 SW Road, Everett, WA",
        animals: "Dogs, cats, reptiles",
        about: "Our shelter provides top care to a number of different animals.",
        website: "example.com"
      }
    },
    {
      include: [Shelter]
    }
  )
  console.log("Created test shelter account.")

  await Message.create({ sender: "test", recipient: "admin", subject: "Some subject", contents: "The message contents go here if they are not too long."})
  console.log("Created test message.")

  await Message.create({ sender: "test", recipient: "nick", subject: "Some subject", contents: "This is Offensive Content from Tester!"})
  console.log("Created test message.")

  await Post.create({
    author: "test",
    status: "Lost",
    name: "test Name",
    type: "Cat",
    city: "test city",
    state: "test state",
    description: "Test description goes here if it is not too long.",
    Tags: [{ name: "tag1" }, { name: "tag2" }, { name: "orange" }]
  },
  {
    include: [Tag]
  })

  await Post.create({
    author: "admin",
    status: "Found",
    name: "Some Dog",
    type: "Dog",
    city: "A City",
    state: "A State",
    description: "Admin post description",
    Tags: [{ name: "tag1" }, { name: "brown" }, { name: "lab" }]
  },
  {
    include: [Tag]
  })

  await Post.create({
    author: "nick",
    status: "Found",
    name: "other Dog",
    type: "Dog",
    city: "A City",
    state: "A State",
    description: "Admin post description",
    Tags: [{ name: "tag1" }, { name: "black" }, { name: "lab" }]
  },
  {
    include: [Tag]
  })
  console.log("Created test posts.")

  await SiteBlogs.create({
    author: "Dumby",
    title: "Shouldn't make it to Home Page",
    slug: "my-first-blog",
    content: "<p>If I did this right you should have to go to Blog list to see this.</p>",
    featuredImage: "/images/blog_uploads/blog3.webp"
  })
  console.log("Created test blog.")

  await SiteBlogs.create({
    author: "Frank",
    title: "Pawsitive Plates: Keeping Your Pets Safe at Mealtime",
    slug: "my-second-blog",
    content: "<p>Our furry friends bring us so much joy, and we want to keep them healthy and happy. A big part of that is making sure their food is safe! This blog post will cover some essential food safety tips for your beloved pets.</p><h2>The Dangers of Unsafe Food</h2><p>Just like humans, pets can get sick from contaminated food. Bacteria like Salmonella and E. coli can cause vomiting, diarrhea, and other serious health problems. It's crucial to take precautions to prevent these issues.</p><h2>Top Food Safety Tips</h2><ul><li><strong>Wash Your Hands:</strong> Always wash your hands thoroughly with soap and water before and after handling pet food, especially raw food.</li><li><strong>Clean Bowls Regularly:</strong> Food bowls should be washed daily with hot, soapy water. This prevents bacteria buildup.</li><li><strong>Proper Storage:</strong> Store pet food according to the manufacturer's instructions. Dry food should be kept in a cool, dry place in a sealed container. Refrigerate wet food after opening and discard any leftovers after a few days.</li><li><strong>Check Expiration Dates:</strong> Don't feed your pet food that has expired.</li><li><strong>Avoid These Foods:</strong> Some human foods are toxic to pets. These include chocolate, onions, garlic, grapes, raisins, and foods containing the artificial sweetener xylitol.</li><li><strong>Raw Food Precautions:</strong> If you feed your pet a raw food diet, be extra careful! Raw meat can contain harmful bacteria. Follow strict hygiene practices, and talk to your vet to make sure the diet is balanced.</li></ul><h2>A Note About Treats</h2><p>Treats are a great way to reward your pet, but they should be given in moderation. Choose healthy treats and avoid those with artificial colors, flavors, or preservatives. Make sure treats are appropriate for your pet's size and species.</p><h2>When to Call the Vet</h2><p>If your pet exhibits signs of food poisoning, such as vomiting, diarrhea, lethargy, or loss of appetite, contact your veterinarian immediately.</p><h2>Conclusion</h2><p>By following these simple food safety guidelines, you can help ensure your pet enjoys a long, healthy, and happy life. A little extra care at mealtime goes a long way!</p>",
    featuredImage: "/images/blog_uploads/blog2.jpeg"
  })
  console.log("Created test blog.")

  await SiteBlogs.create({
    author: "Stuwart",
    title: "Keeping Your Furry Friends Safe: A Little Vigilance Goes a Long Way",
    slug: "my-third-blog",
    content: " <p>The heart-stopping moment when you realize your beloved pet isn't where they should be is something no pet owner wants to experience. That surge of panic, the frantic searching, the desperate calls – it's a nightmare scenario. While accidents can happen, there are simple yet crucial steps we can all take to significantly reduce the risk of our furry, scaled, or feathered companions going astray.</p><p>It boils down to a little extra vigilance and proactive planning. Here are a few key reminders:</p><ul><li><strong>Secure Your Boundaries:</strong> Regularly check fences and gates for any weaknesses or escape routes. Even a small hole can be an invitation for a curious pet.</li><li><strong>ID is Essential:</strong> Ensure your pet has proper identification. Microchipping is a fantastic permanent solution, and a collar with up-to-date tags (including your phone number) provides immediate contact information.</li><li><strong>Leash Up:</strong> When out and about, always keep your dog on a leash. Even the best-behaved dogs can be startled or tempted by something.</li><li><strong>Be Mindful Indoors:</strong> Be cautious when opening doors and windows, especially if your pet is quick or easily spooked.</li><li><strong>Educate Visitors:</strong> Remind guests to be mindful of doors and gates, especially if they aren't used to being around pets.</li></ul><p>Losing a pet is devastating. By taking these preventative measures, we can create a safer environment for our animal companions and hopefully avoid that agonizing moment of realizing they're gone. A little effort today can save a lot of heartache tomorrow. Let's keep our furry (and not-so-furry) family members safe and sound!</p>",
    featuredImage: "/images/blog_uploads/blog1.avif"
   
  })
  console.log("Created test blog.")

  await SiteBlogs.create({
    author: "Tony TwoPaw",
    title: "Pampered Pets: A Guide to Grooming",
    slug: "my-fourth-blog",
    content: "<p>Grooming is an essential part of pet care, contributing not only to their appearance but also to their overall health and well-being. Regular grooming helps prevent matting, reduces shedding, and allows you to check for any skin issues or parasites. This guide will cover the basics of pet grooming for various animals.</p><h2>Why is Grooming Important?</h2><p>Beyond keeping your pet looking their best, grooming offers several health benefits:</p><ul><li><strong>Prevents Matting:</strong> Regular brushing prevents fur from becoming tangled and matted, which can be painful and lead to skin problems.</li><li><strong>Reduces Shedding:</strong> Brushing removes loose hair, minimizing shedding around your home.</li><li><strong>Promotes Healthy Skin:</strong> Grooming stimulates blood flow to the skin, distributing natural oils and keeping it healthy.</li><li><strong>Early Detection of Problems:</strong> Grooming provides an opportunity to check for lumps, bumps, fleas, ticks, or other skin abnormalities.</li><li><strong>Strengthens the Bond:</strong> Grooming can be a relaxing and enjoyable experience for both you and your pet, strengthening your bond.</li></ul><h2>Grooming Essentials</h2><p>The tools you'll need will vary depending on your pet's species and coat type. Here are some common grooming tools:</p><ul><li><strong>Brushes:</strong> Different types of brushes are available, including slicker brushes, bristle brushes, and undercoat rakes.</li><li><strong>Combs:</strong> Combs help to remove tangles and mats, especially in long-haired pets.</li><li><strong>Nail Clippers:</strong> Specialized clippers are needed to trim your pet's nails safely.</li><li><strong>Shampoo and Conditioner:</strong> Use pet-specific shampoo and conditioner to avoid irritating their skin.</li><li><strong>Towels:</strong> Soft, absorbent towels for drying.</li><li><strong>Grooming Wipes:</strong> For quick clean-ups between baths.</li></ul><h2>Grooming by Animal Type</h2><h3>Dogs</h3><p>Grooming frequency varies depending on breed and coat type. Long-haired breeds require daily brushing, while short-haired breeds may only need weekly brushing. Regular nail trims, ear cleaning, and occasional baths are also essential.</p><h3>Cats</h3><p>Cats are generally good at self-grooming, but regular brushing is still important, especially for long-haired cats, to prevent hairballs. Nail trims are also necessary.</p><h3>Small Animals (Rabbits, Guinea Pigs)</h3><p>Long-haired rabbits and guinea pigs need daily brushing. Short-haired varieties require less frequent grooming. Nail trims are also important.</p><h3>Birds</h3><p>Birds primarily groom themselves, but you can help by providing a shallow dish of water for bathing. Nail and beak trims may be necessary, but it's best to consult an avian veterinarian for these procedures.</p><h2>Tips for a Positive Grooming Experience</h2><ul><li><strong>Start Early:</strong> Introduce grooming to your pet when they are young to get them used to the process.</li><li><strong>Be Gentle:</strong> Grooming should be a positive experience. Use gentle strokes and avoid pulling on their fur.</li><li><strong>Keep Sessions Short:</strong> Start with short grooming sessions and gradually increase the duration as your pet becomes more comfortable.</li><li><strong>Use Positive Reinforcement:</strong> Reward your pet with treats and praise during and after grooming.</li><li><strong>Be Patient:</strong> Some pets may be resistant to grooming at first. Be patient and consistent, and they will eventually adjust.</li></ul><h2>Conclusion</h2><p>Regular grooming is a vital part of responsible pet ownership. By understanding your pet's specific needs and following these guidelines, you can help them stay healthy, comfortable, and looking their best!</p>",
    featuredImage: "/images/blog_uploads/blog4.jpg"
  })
  console.log("Created test blog.")

}



sequelize.sync({ force: true }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then()
})

module.exports = app;
