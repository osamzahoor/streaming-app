const mongoose = require('mongoose')
const Video = require('../models/video.model');
const Comment = require('../models/comment.model'); 

/**
 * Upload Video Controller
 * Allows an admin to upload a video with metadata.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Contains video metadata (title, hashtags)
 * @param {string} req.body.title - The title of the video
 * @param {Array<string>} req.body.hashtags - An array of hashtags associated with the video
 * @param {Object} req.fileDetails - File details from the file upload middleware
 * @param {string} req.fileDetails.url - The URL of the uploaded video file
 * @param {Object} req.user - User object populated by authentication middleware
 * @param {string} req.user.role - The role of the authenticated user (must be 'admin')
 * @param {Object} res - Express response object
 * @returns {JSON} Response with video details or an error message
 */
exports.uploadVideo = async (req, res) => {
    try{
    if (req.user.role !== 'admin') {
        return res.status(403).send("Unauthorized");
    }

    const { title, hashtags } = req.body;
    const videoUrl = req.fileDetails.url;
    const video = await Video.create({
        title,
        hashtags,
         url: videoUrl
    });
    const responseDetails = {
      video,
      fileDetails: req.fileDetails 
  };
    res.status(201).json({success: true, message: "Video uploaded successfullly!", responseDetails});
}catch(error){
    res.status(500).json({ message: error });
}
};

/**
 * Get All Videos Controller
 * Retrieves all videos along with their associated comments.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Response with a list of videos and their associated comments
 */
exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        const videosWithComments = await Promise.all(
            videos?.map(async (video) => {
                const comments = await Comment.find({ videoId: video._id })
                    .populate('userId') 
                    .select('comment userId videoId');
                return {
                    ...video._doc,
                    url: `${video.url}`,
                    comments: comments, 
                };
            })
        );

        res.status(200).json(videosWithComments);
    } catch (error) {
        res.status(500).json({ message: "An unexpected error occurred while retrieving videos." });
    }
};

/**
 * Get Video Details Controller
 * Fetches detailed information about a specific video, including its comments.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.id - The ID of the video to retrieve
 * @param {Object} res - Express response object
 * @returns {JSON} Response with video details and associated comments or an error message
 */
exports.getVideoDetails = async (req, res) => {
    try {
      const videoId = req.query.id;
  
      // Use aggregation to get the video details along with the comments
      const video = await Video.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(videoId) } 
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id', 
            foreignField: 'videoId', 
            as: 'comments' 
          }
        },
        {
          $project: {
            title: 1,
            url: 1,
            hashtags: 1,
            comments: 1 
          }
        }
      ]);
  
      // Check if video is found
      if (!video || video.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Ensure the URL is absolute
      if (video[0].url && !video[0].url.startsWith('http')) {
        video[0].url = new URL(video[0].url, `${req.protocol}://${req.get('host')}`).href;
      }
  
      // Send the video with comments in the response
      res.status(200).json(video[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching video details' });
    }
  };
  
