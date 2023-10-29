var express = require('express');
var router = express.Router(); 
const youtubedl = require('youtube-dl-exec')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
module.exports = router;
