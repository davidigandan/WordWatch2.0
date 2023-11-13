// Index.js Requires
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const { setupFfmpegPaths } = require('../Middleware/middleware');
const userController = require('../Controllers/userControllers');

// Use the configurations in the .env file
dotenv.config();

/* GET home page. */
router.get('/', userController.getIndex);
// Convert video url to mp3
router.post("/convert-mp3", setupFfmpegPaths, userController.convertMp3);
// Go to Transcription Centre
router.get('/transcription-centre',userController.transcriptionCentre);
// Transcribe the video consists of a get request, which calls a function. Within this function is an axios post request that sends the data to Azure CS
router.get('/transcribe/:filename', userController.transcribe);

module.exports = router;
