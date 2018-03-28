var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var _ = require("lodash");
var index = require('./routes/index');
var passport = require("passport");
var passportoption = require("./libs/auth");
var app = express();


//mongoose config :
var db=require('./database_connector/connector');
var users=require('./api/user');
var test=require('./api/testcountry');
//var weatherData=require('./api/weatherData');
var weatherStation=require('./routes/backOffice/weatherStation');
var transaction=require('./routes/backOffice/transaction');
var weatherData=require('./routes/frontOffice/weatherData');
var login=require('./routes/login/login');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use('/', index);
app.use('/users', passportoption.passport.authenticate('jwt', { session: false }) ,users);
app.use('/weatherData', passportoption.passport.authenticate('jwt', { session: false }), weatherData);
app.use('/weatherStation', passportoption.passport.authenticate('jwt', { session: false }), weatherStation);
app.use('/transaction', passportoption.passport.authenticate('jwt', { session: false }), transaction);
app.use('/test', passportoption.passport.authenticate('jwt', { session: false }), test);
app.use('/login', login);

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
