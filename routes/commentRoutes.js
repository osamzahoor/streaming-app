const express = require('express');
const router = express.Router();
const { addComment } = require('../controller/commentController');
const authenticate = require('../services/api').authenticate;

// Add Comment
router.post('/add', authenticate, addComment);

module.exports = router;
