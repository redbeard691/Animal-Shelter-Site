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
const { Post, Tag } = require('./model/Post');


// Routes ----------------------------------
var indexRouter = require('./routes/index');
// Info Routes
var blogRouter = require('./routes/info/blog');
var bulletinRouter = require('./routes/info/bulletins');

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
}

sequelize.sync({ force: true }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then()
})

module.exports = app;
