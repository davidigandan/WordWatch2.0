//Middleware for pointing to ffmpeg and ffprobe binary locations
const setupFfmpegPaths = (req, res, next) => {
    const ffmpegPath = '/usr/bin/ffmpeg';
    const ffprobePath = '/usr/bin/ffprobe';

    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);

    next();
};

module.exports = {
    setupFfmpegPaths,
};