var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db')

// Models
const User = require('./model/User')


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
// Account Routes
var loginRouter = require('./routes/account/login');
var profileRouter = require('./routes/account/profile');
var settingsRouter = require('./routes/account/settings');
var signupRouter = require('./routes/account/signup');
var logoutRouter = require('./routes/account/logout');
// Messages Routes
var composeRouter = require('./routes/messages/compose');
var inboxRouter = require('./routes/messages/inbox');
// Post Routes
var demo_listingRouter = require('./routes/posts/demo_listings');
var editRouter = require('./routes/posts/edit');
var listingsRouter = require('./routes/posts/listings');
var viewRouter = require('./routes/posts/views');


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

// Our Pages
app.use('/', indexRouter);

//app.delete('/logout', logoutRouter);

app.use('/template/header',headerRouter);
// Info
app.use('/pages/info/about',aboutRouter);
app.use('/pages/info/blog',blogRouter);
app.use('/pages/info/bulletins',bulletinRouter);
app.use('/pages/info/search',searchRouter);
app.use('/pages/info/shelter',shelterRouter);
app.use('/pages/info/sheltermap',sheltermapRouter);
// Account
app.use('/pages/account/login',loginRouter);
app.use('/pages/account/profile',profileRouter);
app.use('/pages/account/settings',settingsRouter);
app.use('/pages/account/signup',signupRouter);
// Message
app.use('/pages/messages/compose',composeRouter);
app.use('/pages/messages/inbox',inboxRouter);
// Post
app.use('/pages/posts/demo_listings',demo_listingRouter);
app.use('/pages/posts/edit',editRouter);
app.use('/pages/posts/listings',listingsRouter);
app.use('/pages/posts/view',viewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// To keep account if user is logged in or not.
//app.use(function(err, req, res, next) {
  //res.locals.session = req.session;
  //next();
//});



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
  const subu = await User.create({ username: "nick", password: "1234" });
  console.log("nick instance created...")
}

sequelize.sync({ force: true }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then(()=> console.log("User setup complete"))
})

module.exports = app;
