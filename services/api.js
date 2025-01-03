/**
 * Middleware Utilities
 * This file provides the following middleware utilities:
 * 
 * 1. `upload`: Configured using Multer for handling file uploads.
 *    - Multer is used for processing multipart form-data, especially for file uploads.
 * 
 * 2. `authenticate`: Middleware for authenticating users via JSON Web Tokens (JWT).
 *    - Verifies the JWT passed in the `Authorization` header.
 *    - Ensures the token is valid and attaches the decoded user information to `req.user`.
 * 
 * Security:
 * - Uses a shared secret (`SECRET`) to sign and verify tokens.
 * - Prevents access to protected routes for unauthenticated or unauthorized users.
 */
const multer = require('multer');
const jwt = require('jsonwebtoken');
const upload = multer();

// Authentication middleware
const SECRET = "supersecretkey";
/**
 * Authentication Middleware
 * Verifies the provided JWT token and authorizes the user.
 * 
 * Workflow:
 * - Reads the `Authorization` header from the incoming request.
 * - Extracts and verifies the JWT using the shared secret.
 * - If valid, attaches the decoded user information to `req.user` and calls `next()`.
 * - If invalid or missing, sends a 401 (Unauthorized) or 403 (Forbidden) response.
 * 
 * @param {Object} req - Incoming HTTP request
 * @param {Object} res - HTTP response object
 * @param {Function} next - Callback to pass control to the next middleware
 * @returns {void}
 */
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Unauthorized");

    jwt.verify(token.split(" ")[1], SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token");
        req.user = user;
        next();
    });
};

/**
 * Exports:
 * - `upload`: Multer instance for file handling.
 * - `authenticate`: JWT authentication middleware.
 * 
 * @module middlewares
 */
module.exports = { upload, authenticate };
