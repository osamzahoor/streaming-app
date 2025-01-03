/**
 * Server Setup for Video Streaming Application
 * 
 * This script initializes an Express server, connects to MongoDB, and defines routes for the backend services of a video streaming platform.
 * 
 * Features:
 * - Handles user authentication, video management, and comment management routes.
 * - CORS enabled for cross-origin requests.
 * - Serves React frontend in production mode.
 * - Graceful handling of unmatched routes with a 404 response.
 * 
 * Dependencies:
 * - Express for server framework.
 * - Mongoose for MongoDB object modeling.
 * - Body-parser for parsing incoming request bodies.
 * - CORS for managing cross-origin requests.
 * - Path for resolving file paths.
 */
const express = require('express'); // Framework for building REST APIs
const mongoose = require('mongoose'); // MongoDB object modeling
const bodyParser = require('body-parser'); // Middleware for parsing JSON request bodies
const cors = require('cors'); // Middleware for handling cross-origin requests
const path = require("path"); // Core Node.js module for working with file paths
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration

// Body-parser middleware to parse JSON data from requests
app.use(bodyParser.json());

// CORS middleware to allow requests from any origin
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, 
  };
app.use(cors(corsOptions));

// MongoDB Connection 
mongoose.connect('mongodb+srv://osamzahoor:CyWBNqhb3ovJ81pE@cluster0.axxne.mongodb.net/',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Route Definitions

// Authentication routes for user registration, login, and other auth features
app.use('/api/auth', authRoutes);

// Video routes for uploading, fetching, and managing video content
app.use('/api/videos', videoRoutes);

// Comment routes for adding and fetching comments on videos
app.use('/api/comments', commentRoutes);

// Production Setup for React Frontend

// Serve React build in production
app.use(express.static("./client/build"));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Catch-all route to serve React's index.html for any unmatched route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Default 404 Route

// Catch-all route for handling unmatched requests and sending a 404 response
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the Server

// Start listening on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});