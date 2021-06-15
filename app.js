const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const { flash } = require('express-flash-message');
const db = require('./models');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const productRouter = require('./routes/products');
const securityRouter = require('./routes/security');
const cartRouter = require('./routes/cart');

const app = express();

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware cookies
app.use(async (req, res, next) => {
  if (req.cookies.userId !== undefined && req.session.user === undefined) {
    req.session.user = await db.User.findByPk(req.cookies.userId);
  }
  next();
});

// Middleware session
app.use((req, res, next) => {
  if (req.session.user !== undefined) res.locals.user = req.session.user;
  if (req.session.cart !== undefined) res.locals.cart = req.session.cart;
  next();
});

// get flash messages
app.use(async (req, res, next) => {
  res.locals.flash = {
    success: await req.consumeFlash('success'),
    info: await req.consumeFlash('info'),
    danger: await req.consumeFlash('danger'),
    warning: await req.consumeFlash('warning'),
  };
  next();
});

app.use('/', indexRouter);
app.use('/', securityRouter);
app.use('/user', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.project = {
  title: 'The Old Market',
};

module.exports = app;
