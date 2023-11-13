const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');


const userController = {

    // Index Page Logic
    getIndex: (req, res, next) => {
        let returning = false;
        res.render('index', { returning });
    },

    // convert to MP3 Logic
    convertMp3: async (req,res) => {
        const videoUrl = req.body.url;

        youtubedl.exec(videoUrl, {
            'output': `./downloads/%(title)s.%(ext)s`,
            'no-check-certificate': true,
            f: 'bestaudio',
            extractAudio: true,
            audioFormat: 'mp3'
        }) .then(output => {
                console.log('Video downloaded:');
                let returning = "true";
                return res.render("index", { returning });
        }) .catch(error => {
                console.error('Error downloading video: ', error);
        });
    },

    transcriptionCentre: (req, res) => {
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
                return [];
            }
        }

        let files = getFilesFromDirectory();
        res.render('transcription-centre', { files });
    },

    transcribe: async (req, res) => {
        const transcription = '1';
        res.send(`Transcription: ${transcription}`);
    },

};

module.exports = userController;