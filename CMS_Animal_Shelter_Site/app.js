var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const sequelize = require('./db');

// Models
const User = require('./model/User');
const Message = require('./model/Message');
const { Post, Tag } = require('./model/Post');
const Bulletin = require("./model/Bulletin");


// Routes ----------------------------------
var indexRouter = require('./routes/index');
var headerRouter = require('./routes/header');
// Info Routes
var aboutRouter = require('./routes/info/about');
var blogRouter = require('./routes/info/blog');
var bulletinRouter = require('./routes/info/bulletins');
var searchRouter = require('./routes/info/search');
var shelterRouter = require('./routes/info/shelter');
var sheltermapRouter = require('./routes/info/sheltermap');

var accountRouter = require('./routes/account');
var messageRouter = require('./routes/messages');
var postRouter = require('./routes/posts');
var adminRouter = require('./routes/admin');

var bulletinRouter = require('./routes/info/bulletins')


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

app.use('/template/header',headerRouter);
// Info
app.use('/pages/info/about',aboutRouter);
app.use('/pages/info/blog',blogRouter);
app.use('/pages/info/bulletins',bulletinRouter);
app.use('/pages/info/search',searchRouter);
app.use('/pages/info/shelter',shelterRouter);
app.use('/pages/info/sheltermap',sheltermapRouter);

app.use('/account', accountRouter);
app.use('/messages', messageRouter);
app.use('/posts', postRouter);
app.use('/admin', adminRouter);

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

async function setup() {
  await User.create({ username: "admin", password: "1234", email:"admin@example.com", isadmin: true});
  console.log("Created admin account.")
  await User.create({ username: "test", password: "test", email:"test@example.com"})
  console.log("Created test user account.")
  await User.create({ username: "nick", password: "1234", email:"nick@example.com"})
  console.log("Created test user account.")

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
    Tags: [{ name: "tag1" }, { name: "brown" }, { name: "lab" }]
  },
  {
    include: [Tag]
  })
  console.log("Created test posts.")

  await Bulletin.create({
    title: "Food recall on XYZ Kibble",
    contents: "XYZ kibble has been recalled due to salmonella contamination. You are advised to throw out any food with a best by date of 6/20"
  })
  await Bulletin.create({
    title: " ABC branded rope toy recalled",
    contents: "ABC branded rope toys have been recalled due to unsafe chemicals in the cotton rope."
  })

}



sequelize.sync({ force: true }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then()
})

module.exports = app;
