const Comment = require('../models/comment.model');
const Video = require('../models/video.model');

/**
 * Add Comment Controller
 * Allows an authenticated user to add a comment to a video.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Contains the details of the comment and associated video
 * @param {string} req.body.videoId - The ID of the video to which the comment is being added
 * @param {string} req.body.comment - The text of the comment to be added
 * @param {Object} req.user - User object populated by authentication middleware
 * @param {string} req.user.id - The ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {JSON} Response with the newly created comment or an error message
 */
exports.addComment = async (req, res) => {
    try{
    const { videoId,  comment } = req.body;
    const userId = req.user.id;

    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).send("Video not found");
    }

    const newComment = await Comment.create({ videoId, userId, comment });
    res.status(201).json(newComment);
}catch(error){
    res.status(500).json({ message: error });
}
};
