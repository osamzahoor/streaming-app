/**
 * User Schema
 * This file defines the schema for storing user information in the MongoDB database.
 * 
 * Each user has the following fields:
 * - `username`: The unique username of the user
 * - `email`: The user's email address (must be unique)
 * - `password`: The hashed password for the user
 * - `bio`: Optional short biography or description of the user
 * - `location`: Optional location information of the user
 * - `avatarUrl`: Optional URL to the user's profile avatar
 * - `role`: Defines the role of the user, which can be either `user` or `admin`
 * - `createdAt`: The timestamp when the user was created
 * - `updatedAt`: The timestamp when the user was last updated (auto-updated)
 * 
 * Additional Functionality:
 * - Middleware: Automatically updates the `updatedAt` field whenever a user document is saved.
 * 
 * Relationships:
 * This schema is part of a broader application that handles user authentication and role-based access control.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    location: { type: String },
    avatarUrl: { type: String }, // Ensure this is a String
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
});

// Middleware to automatically update the `updatedAt` field before saving
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
