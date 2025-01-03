
const mongoose = require('mongoose');
/**
 * Comment Schema
 * This file defines the schema for storing user comments on videos in the MongoDB database.
 * 
 * Each comment is associated with:
 * - A specific video (referenced by `videoId`)
 * - The user who posted the comment (referenced by `userId`)
 * 
 * Fields:
 * - `videoId`: Links the comment to the video it belongs to
 * - `userId`: Links the comment to the user who posted it
 * - `comment`: The text of the user's comment
 * 
 * Relationships:
 * - `videoId` references the `Video` model
 * - `userId` references the `User` model
 * 
 * This schema is part of a larger video streaming or video-sharing platform.
 */
const commentSchema = new mongoose.Schema({
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
});
module.exports = mongoose.model('Comment', commentSchema);