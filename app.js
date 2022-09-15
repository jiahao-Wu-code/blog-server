var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { expressjwt: jwt } = require("express-jwt");
const md5 = require('md5');
const session = require('express-session')

const { ForbiddenError, ServiceError, UnknownError } = require("./utils/error")




var app = express();

require('dotenv').config();
require('express-async-errors');
require('./dao/db')

var adminRouter = require('./routes/admin');
var captchRouter = require('./routes/captcha');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置验证 token 接口

app.use(jwt({
  secret: md5(process.env.JWT_SECRET),
  algorithms: ['HS256'],
}).unless({
  path: [
    {
      url: "/api/admin/login",
      methods: ["POST"]
    }, {
      url: "/api/res/captcha",
      methods: ["GET"]
    }
  ]
}))



app.use('/api/admin', adminRouter);
app.use('/api/res/captcha', captchRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // token 验证失败
  console.log('err.name', err.name);
  console.log('err.message', err.message);
  if (err.name === 'UnauthorizedError') {
    res.send(new ForbiddenError("未登录，或者登录已经过期").toResponseJSON())
  } else if (err instanceof ServiceError) {
    res.send(err.toResponseJSON());
  } else {
    res.send(new UnknownError().toResponseJSON());
  }
});

module.exports = app;
