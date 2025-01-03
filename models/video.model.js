/**
 * Video Schema
 * This file defines the schema for storing video information in the MongoDB database.
 * 
 * Each video has the following fields:
 * - `title`: The title of the video (required)
 * - `url`: The URL of the video file or source (required)
 * - `hashtags`: Optional hashtags or keywords associated with the video
 * 
 * Purpose:
 * This schema is part of a video-sharing platform, where each video entry is stored with essential metadata.
 */
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    hashtags: { type: String },
});

module.exports = mongoose.model('Video', videoSchema);