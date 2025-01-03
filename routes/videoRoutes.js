const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos, getVideoDetails } = require('../controller/videoController');
const azureStorage = require('../services/azureStorage');
const authenticate = require('../services/api').authenticate;

// Video Upload
router.post('/upload', authenticate, azureStorage.uploadVideo('video'), uploadVideo);

// Get Videos
router.get('/',  getVideos);
router.get('/get',  getVideoDetails);

module.exports = router;
