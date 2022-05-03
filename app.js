var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
const bcrypt = require('bcrypt')
const MongoStore = require('connect-mongo')

const User = require('./models/user')

// authentication validators
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const helmet = require('helmet')
const compression = require('compression')

var app = express();

// database setup
const mongoose = require('mongoose');
const { doesNotMatch } = require('assert');
const user = require('./models/user');
const { Result } = require('express-validator');
const mongoDB = process.env.DB_URI
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, "MongoDB connection error:"))

app.use(helmet())
app.use(compression())

// PASSPORT middleware
app.use(session
  ({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URI,
    ttl: 14 * 24 * 60 * 60
    })
  })
)  
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },

    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, { message: 'Incorrect username' })
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Incorrect password' })
          }
        })
      })
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})


app.use(express.urlencoded({extended: false}))
app.use(function(req, res, next) {
  res.locals.currentUser = req.user
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
