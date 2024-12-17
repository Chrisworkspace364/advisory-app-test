const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // Load .env

// Import
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const { router: listingRouter } = require('./API/listing');;
const loginRouter = require('./API/login');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Route
app.use('/', indexRouter);

app.use('/dashboard', dashboardRouter);

// API
app.use('/api', loginRouter);
app.use('/api', listingRouter);


// Error Handling
app.use((req, res, next) => {
  res.status(404).send(`Route ${req.originalUrl} not found`);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error occurred: ${err.message}`);

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Export 
module.exports = app;
