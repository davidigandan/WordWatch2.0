var express = require('express');
var router = express.Router();
const youtubedl = require('youtube-dl-exec');
const request = require('request');
const path = require('path');
const fs = require('fs');
const fsasync = require('fs').promises;
const dotenv = require('dotenv');
const axios = require('axios');
const sdk = require("microsoft-cognitiveservices-speech-sdk");

dotenv.config();



/* GET home page. */
router.get('/', function(req, res, next) {
  let returning = false;
  res.render('index', { returning });
});
// Convert video url to mp3
router.post("/convert-mp3", async (req, res) => {

  const videoUrl = req.body.url;

  // Invoke youtube-dl with the specified options

  youtubedl.exec(videoUrl, {'output': `./downloads/%(title)s.%(ext)s`, 'no-check-certificate':true,f: 'bestaudio',
        extractAudio: true,
        audioFormat: 'mp3',})
  .then(output => {
    console.log('Video downloaded:');
    let returning = "true";
    return res.render("index", { returning });
  })
  .catch(error => {
    console.error('Error downloading video:', error);
   });
});
// Go to Transcription Centre
router.get('/transcription-centre', (req, res) => {
  const downloadsFolderPath = "./downloads";
  function getFilesFromDirectory() {
    try {
      const files = fs.readdirSync(downloadsFolderPath);
      const fileObjects = files.map((file) => {
        return {
          name: file,
          path: path.join(downloadsFolderPath, file),
        };
      });

      return fileObjects;
    } catch (error) {
      console.error("Error reading files from the downloads folder: ", error);
      return[];
    }
  }
  let files = getFilesFromDirectory();
  res.render('transcription-centre', { files });
});
// Transcribe the video consists of a get request, which calls a function. Within this function is an axios post request that sends the data to Azure CS
router.get('/transcribe/:filename', async (req, res) => {
  let fileName = req.params.filename;
  let audioFile = `downloads/${fileName}`;

  // Azure Cognitive Services API Configurations
  const speechApiEndpoint = process.env.SPEECH_ENDPOINT;
  const speechApiKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;
  const speechConfig = sdk.SpeechConfig.fromSubscription(speechApiKey, speechRegion);
  const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);

  const speechRecogniser = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  let transcriptions =[];

  function continuousRecognitionHandler(evt) {
    if (evt.result.reason === sdk.ResultReason.RecognizedSpeech) {
      transcriptions.push(evt.result.text);
    }
  }

  // Begin recognition
  speechRecogniser.recognized = continuousRecognitionHandler;
  speechRecogniser.startContinuousRecognitionAsync();

  // Wait for recognition to complete
  const timeoutSeconds = 60;
  const timeoutExpiration = Date.now() + timeoutSeconds * 1000;

  function sleep(ms) {
    return new Promise (resolve => setTimeout(resolve, ms));
  }

  await (async function () {
    try {
      while (Date.now() < timeoutExpiration) {
        await sleep(1000); // Adjust the sleep duration as needed
      }
    } finally {
      // Stop continuous recognition
      await speechRecogniser.stopContinuousRecognitionAsync();

      // Combine transcriptions into a single string
      const transcription = transcriptions.join(' ');

      // Respond with the transcription
      res.send(`Transcription: ${transcription}`);
    }
  })();
});

module.exports = router;
