import axios from "axios";

// Create an Axios instance with baseURL set to the server address
const API = axios.create({ baseURL:"https://stream-app-rg.azurewebsites.net" });
// Interceptor to attach JWT token from localStorage to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.authorization = `Bearer ${token}`;
    return req;
});

/**
 * Sign up a new user
 * @param {Object} data - The user data for registration
 * @param {string} data.username - The username of the new user
 * @param {string} data.email - The email address of the new user
 * @param {string} data.password - The password for the new user
 * @returns {Promise} - The API response containing the new user's data
 */
export const signup = (data) => API.post("/api/auth/signup", data);

/**
 * Log in an existing user
 * @param {Object} data - The login credentials
 * @param {string} data.email - The email address of the user
 * @param {string} data.password - The password of the user
 * @returns {Promise} - The API response containing a JWT token and user data
 */
export const login = (data) => API.post("/api/auth/login", data);

/**
 * Get the profile of the currently logged-in user
 * @returns {Promise} - The API response containing the user's profile data
 */
export const getUserProfile = () => API.get("/api/auth/profile");

/**
 * Update the user profile with new data
 * @param {Object} formData - The data to update the user's profile
 * @param {string} [formData.username] - The new username (optional)
 * @param {string} [formData.email] - The new email address (optional)
 * @param {string} [formData.bio] - The new bio (optional)
 * @param {string} [formData.location] - The new location (optional)
 * @param {string} [formData.password] - The new password (optional)
 * @returns {Promise} - The API response confirming the profile update
 */
export const updateUserProfile = (formData) => API.put("/api/auth/update", formData);

/**
 * Fetch a list of all available videos
 * @returns {Promise} - The API response containing a list of videos
 */
export const getVideos = () => API.get("/api/videos/");

/**
 * Fetch detailed information of a specific video by ID
 * @param {string} id - The ID of the video to fetch
 * @returns {Promise} - The API response containing video details (title, URL, hashtags, comments, etc.)
 */
export const getVideoDetails = (id) => API.get(`/api/videos/get?id=${id}`);

/**
 * Upload a new video to the platform
 * @param {Object} data - The data for uploading the video
 * @param {string} data.title - The title of the video
 * @param {string} data.hashtags - The hashtags associated with the video
 * @param {File} data.video - The video file to upload
 * @returns {Promise} - The API response containing details of the uploaded video
 */
export const uploadVideo = (data) => API.post("/api/videos/upload", data);

/**
 * Add a comment to a video
 * @param {Object} data - The comment data
 * @param {string} data.videoId - The ID of the video the comment is for
 * @param {string} data.comment - The content of the comment
 * @returns {Promise} - The API response containing the new comment data
 */
export const addComment = (data) => API.post("/api/comments/add", data);