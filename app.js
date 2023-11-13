// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fetch = require("node-fetch");
const expressLayouts = require('express-ejs-layouts');
require("dotenv").config();
const ffmpeg = require('fluent-ffmpeg');



// Initialise express app using the variable app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const http = require('http');
const https = require('https');

// Middleware

// Standard middleware
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes are located at  userRoutes.js
const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

// Error handling Middleware
// Catch 404 and forward to error handler
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


app.use(express.urlencoded({
  extended: true
}))

// Declare port number
const PORT =  4000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})

// Middleware for webhook to mp3 conversion
app.use((req,res,next) => {
  const ffmpegPath = '/usr/bin/ffmpeg'; // Update with your actual path
  const ffprobePath = '/usr/bin/ffprobe'; // Update with your actual path

  const ffmpeg = require('fluent-ffmpeg');
  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);
  next();

})



module.exports = app;
