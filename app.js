var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
// for passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./app_server/routes/index');
var users = require('./app_server/routes/users');
var views = require('./app_server/routes/views');
var matchs = require('./app_server/routes/match');
var api = require('./app_server/routes/api');

var flash = require('connect-flash');

var app = express();
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'app_server' , 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
//for passport

app.use(passport.initialize());
app.use(passport.session());
//end for passport
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);   // get index page and register/login
app.use('/users', users); // edit user profile and preference
app.use('/view',views);  // view and communication features
app.use('/match',matchs); // match features
app.use('/api',api); // api routes
//passport config
var Account = require('./app_server/models/account');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
