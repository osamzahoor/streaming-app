/**
 * Main App Component for React Application
 * 
 * This file contains the main routing configuration for the React app. It defines the structure of the routes and the pages 
 * accessible to users and admins. It also integrates the ToastContainer for user notifications.
 * 
 * Features:
 * - Routes users to the appropriate pages based on their authentication status.
 * - Protected routes to ensure only authenticated users can access specific pages (e.g., user dashboard).
 * - Integration of Toast notifications for success or error messages.
 * 
 * Dependencies:
 * - React Router (for routing).
 * - React Toastify (for toast notifications).
 * 
 * Note: The ProtectedRoute component is used to guard certain routes and ensure only authorized users can access them.
 */

import React from "react"; // React library for building UI components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router for navigation and routing
import { ToastContainer } from "react-toastify"; // Toastify for user notifications
import Auth from "./components/Auth"; // Auth component for login/signup
import AdminDashboard from "./components/AdminDashboard"; // Admin Dashboard for admin users
import UserDashboard from "./components/UserDashboard"; // User Dashboard for regular users
import Profile from "./components/Profile"; // Profile component for user profile management
import ProtectedRoute from "./ProtactedRoute"; // ProtectedRoute for guarding routes that require authentication
import VideoDetail from "./components/VideoDetails"; // Video Detail page showing details of a selected video
import InfiniteVideoList from "./components/VideoFeed"; // Infinite scroll video list

function App() {
  return (
    <Router>
      <div>
        {/* Define the main routes of the application */}
        <Routes>
          {/* Route to the Infinite Video List page */}
          <Route path="/list" element={<ProtectedRoute element={<InfiniteVideoList />} />} />
          
          {/* Route to the Login page */}
          <Route exact path="/" element={<Auth />} />
          
          {/* Route to the User Profile page */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          
          {/* Route to the Admin Dashboard, accessible only to admins */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
          
          {/* Protected Route for User Dashboard, accessible only if authenticated */}
          <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
          
          {/* Route to the Video Detail page, dynamic based on video ID */}
          <Route path="/video/:id" element={<ProtectedRoute element={<VideoDetail />} />} />
        </Routes>
        
        {/* Toast container for displaying notifications */}
        <ToastContainer
          position="top-right" // Toast position on screen
          autoClose={3000} // Duration before auto closing the toast
          hideProgressBar={false} // Show the progress bar while toast is visible
          closeOnClick // Close on click event for the toast
          rtl={false} // Set to true for right-to-left languages
        />
      </div>
    </Router>
  );
}

export default App;
