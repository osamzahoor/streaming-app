const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controller/authController');
const azureStorage = require('../services/azureStorage');
const authenticate = require('../services/api').authenticate;

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/update', authenticate,  azureStorage.uploadFile('file'), updateProfile);

module.exports = router;
