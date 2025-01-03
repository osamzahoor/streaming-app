const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const SECRET = "supersecretkey";

/**
 * Sign Up Controller
 * Handles user registration by creating a new user in the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Contains user details for signup (username, password, email, role)
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.password - The password of the user
 * @param {string} req.body.email - The email of the user
 * @param {string} req.body.role - The role of the user (e.g., admin, user)
 * @param {Object} res - Express response object
 * @returns {JSON} Response with user details or an error message
 */
exports.signup = async (req, res) => {
    const { username, password, email, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
    }
    try {
        const user = await User.create({ username, password: hash, email, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).send("User already exists");
    }
};

/**
 * Login Controller
 * Authenticates a user and generates a JSON Web Token for session management.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Contains user login details (email, password)
 * @param {string} req.body.email - The email of the user
 * @param {string} req.body.password - The password of the user
 * @param {Object} res - Express response object
 * @returns {JSON} Response with a JWT token and user details or an error message
 */
exports.login = async (req, res) => {
    try{
    const {  email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token, user });
}catch(error){
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
}
};

/**
 * Get Profile Controller
 * Retrieves the profile information of the authenticated user.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object populated by authentication middleware
 * @param {string} req.user.id - The ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {JSON} Response with user profile details or an error message
 */
exports.getProfile = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "Invalid request: User ID is missing." });
      }
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);

    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
  };
  
  /**
 * Update Profile Controller
 * Updates the profile information of the authenticated user.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Contains updated user details (username, email, password, bio, location)
 * @param {string} req.body.username - (Optional) Updated username
 * @param {string} req.body.email - (Optional) Updated email
 * @param {string} req.body.password - (Optional) Updated password
 * @param {string} req.body.bio - (Optional) Updated bio
 * @param {string} req.body.location - (Optional) Updated location
 * @param {Object} req.fileDetails - (Optional) Contains file details (e.g., avatar URL) from file upload middleware
 * @param {string} req.fileDetails.url - (Optional) URL of the uploaded avatar
 * @param {Object} req.user - User object populated by authentication middleware
 * @param {string} req.user.id - The ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {JSON} Response with updated user details or an error message
 */
  exports.updateProfile = async (req, res) => {
    try {
      const { username, email, password, bio, location } = req.body;
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's profile fields if provided
      if (username) user.username = username.trim();
      if (email) user.email = email.trim();
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      if (req.fileDetails && req.fileDetails.url) { 
        user.avatarUrl = req.fileDetails.url; 
    }
      if (bio) user.bio = bio.trim();
      if (location) user.location = location.trim();
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          username: user?.username,
          email: user?.email,
          file: req.fileDetails,
          avatarUrl:user.avatarUrl,
          bio: user?.bio,
          location: user?.location,
          role: user?.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while updating the profile. Please try again later." });
    }
  };
  