require('dotenv').config('./.env');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const ejs = require('ejs');
const mongoose = require('mongoose');


//const favicon = require('serve-favicon');
const expressSession = require("express-session");
const Auth0Strategy = require("passport-auth0");
const passport = require('passport');
const localStrategy = require("passport-local");

const { auth } = require("express-openid-connect");

//require('./app_api/models/db');
//require('./app_api/config/passport');
let cors = require('cors');

const indexRouter = require('./app_server/routes/index');
const { aws_sign_request } = require('aws-crt/dist/native/auth');



const app = express();

/**
 *  Session Configuration (New!)
 */

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'ddbd1cf4308af763659defd546a0b5906feedf593d27abc349cdb28d957ec856',
  baseURL: 'http://localhost:5000',
  clientID: 'slQCIOOeUmYdDm1fkQGMy9e8Gv6XL9zD',
  issuerBaseURL: 'https://intercontinentaklschool.us.auth0.com'

}
if ( app.get('env') === 'production'){
  // Serve secure cookies, requires HTTPS

  session.cookie.secure = true;
}

/**
 *  Passport  Configuration (New!)
 */
// view engine setup
app.set('view engine', 'ejs');
//app.set('view options', {delimiter: '?'});
app.set('views', path.join(__dirname,'app_server', 'views'));

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '5mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'app-public', 'build')));
//app.use(passport.initialize());
app.use((req,res,next)=>{
  res.setHeader('Acces-Control-Allow-Origin','*');
  res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
  next(); 
})
// auth router attaches /login, /logout, and /callback routes to the baseURL
passport.use(new localStrategy(
  function (username, password, done) {
    username.findOne({ username: username}, function(err, user) {
      if(err) { return done(err);}

      if(!user) {
        return done(null, false, { message: "Incorrect username."});
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: "incorrect password."});
      }

      return done(null, user);
    });
  }
));
app.post('/login',
  passport.authenticate('local', { successRedirect: '/teacher',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
app.use('/', indexRouter);
app.get('*', function(req, res, next) {
res.sendFile(path.join(__dirname, 'app-public', 'build', 'index.html'));
});

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
  res.render('pages/error');
});
var port = process.env.PORT || '5000';
app.set('port', port);
app.listen(port, ()=>{
  console.log("listening on port", port);
});
