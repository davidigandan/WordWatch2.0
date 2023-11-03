var express = require('express');
var router = express.Router(); 
const youtubedl = require('youtube-dl-exec')
const request = require('request');
const app = express()
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Convert vido url to mp3
router.post("/convert-mp3", async (req, res) => {

  const videoUrl = req.body.url;

  // Invoke youtube-dl with the specified options

  youtubedl.exec(videoUrl, {'output': `./downloads/%(title)s.%(ext)s`, 'no-check-certificate':true,f: 'bestaudio',
        extractAudio: true,
        audioFormat: 'mp3',})
  .then(output => {
    console.log('Video downloaded:', output);
    return res.render("index", {});
  })
  .catch(error => {
    console.error('Error downloading video:', error);
  });
})

// Transcribe the video
const audioFileName = req.query.audioFileName;

app.post('/transcribe', (req, res) => {
  const audioFilePath = path.join(__dirname, 'downloads', audioFileName );

  const audioFile = fs.createReadStream(audioFilePath);

  const endpoint = process.env.AZURE_SPEECH_ENDPOINT;
  const apiKey = process.env.AZURE_SPEECH_KEY;

  const requestOptions = {
    url: `${endpoint}/speech/recognition/v3.0/transcriptions?language=en-US&profanity=Raw`,
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'audio/mpeg',
    },
    body: audioFile,
  };

  request(requestOptions, (error, response, body) => {
    if (error) {
      res.status(500).send('Error trnascribing audio.');
    } else {
      res.status(response.statusCode).send(body);
    }
  });
});


module.exports = router;
