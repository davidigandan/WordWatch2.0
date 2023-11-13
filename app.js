const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
require("dotenv").config();
const fs = require('fs');

// Note: The Azure Cognitive Services SDK is written in ECMAScript. This webapp is written in Commons JS, hence, we'll use a dynamic import to handle the SDK, and it's associated logic.
import("microsoft-cognitiveservices-speech-sdk").then(
    (sdk) => {
      const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
      speechConfig.speechRecognitionLanguage = "en-US";

      function fromFile(fileName) {
        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(fileName));
        let speechRecogniser = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        speechRecogniser.recognizeOnceAsync(result => {
          switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
              console.log(`RECOGNISED: Text=${result.text}`);
              break;
            case sdk.ResultReason.NoMatch:
              console.log("NOMATCH: Speech could not be recongised.");
              break;
            case sdk.ResultReason.Canceled:
              const cancellation = sdk.CancellationDetails.fromResult(result);
              console.log(`CANCELED: Reason=${cancellation.reason}`);

              if (cancellation.reason === sdk.CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`)
                console.log("CANCELED: Did you set up the speech resource key and region values?");
              }
              break;
          }
          speechRecogniser.close();
        });
      }

      fromFile();
    }).catch((error) => {
  console.log("Failed to import Microsoft Speech SDK", error);
});


// Initialise express app using the variable app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware

// Standard middleware
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
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

// Declare port number
const PORT =  process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})


module.exports = app;
