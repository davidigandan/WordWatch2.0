var express = require('express');
var router = express.Router();
const youtubedl = require('youtube-dl-exec');
const request = require('request');
const app = express()
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

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

// Transcribe the video
router.post('/transcribe', (req,res) => {
  let audioFileName = req.query.audioFileName;

  if(!audioFileName) {
    return res.status(400).json({ error: 'Missing audioFileName parameter.' });
  }

  let audioFilePath = path.join(__dirname, 'audio-folder', audioFileName);

  if (!fs.existsSync(audioFilePath)) {
    return res.status(404).json({ error: 'File not found.' });
  }

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
      res.status(500).json({ error: 'Error transcribing audio.' });
    } else if (response.statusCode === 200) {
      const transcript = JSON.parse(body);
      res.status(200).json({ transcript });
    } else {
      res.status(response.statusCode).json({ error : 'Transcription failed.' });
    }
  });
});


module.exports = router;
