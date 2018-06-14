//dependecies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator  = require('express-validator');
const mongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt-nodejs');
const config = require("./config/config");

//set routers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

//connect to mongoDB
mongoose.connect(config.db_link + '/shopping').catch(err => { // we will not be here...
  console.error('App starting error:', err.stack);
  process.exit(1);
});
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs', helpers: {
  inc: function(value, options){
    return parseInt(value) + 1;
  },
  orderDot: function(str){
    str =  String(str);
    return str.substring(0,11) + '...';
  },
  equal: function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }}
}}));

app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: bcrypt.hashSync(config.hash, bcrypt.genSaltSync(5), null), 
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: config.Sessions_cookie_max_age }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  if (req.user){
    res.locals.admin = Object.keys(req.user).map(function(key) {
      return [Number(key), req.user[key]];
    })[3][1].admin;
  }
  if (req.user){
    res.locals.user = req.user;
  }
  res.locals.session = req.session;
  next();
});
//auto https
app.all('*', ensureSecure);
function ensureSecure(req, res, next){
  if(req.secure){
    return next();
  };
  res.redirect('https://' + req.hostname + req.url);
}
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);

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
module.exports = app;
