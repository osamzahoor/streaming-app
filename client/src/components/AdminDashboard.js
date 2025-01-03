import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadVideo } from "../services/api";
import Loader from "./Loader";

const AdminDashboard = () => {
  // State to handle form data (title and hashtags)
  const [formData, setFormData] = useState({ title: "", hashtags: "" });

  // State to handle the selected video file
  const [video, setVideo] = useState(null);

  // State to manage the upload process (showing loader when uploading)
  const [uploading, setUploading] = useState(false);

  // UseNavigate hook to programmatically navigate the user after upload
  const navigate = useNavigate();

   /**
   * Handle the selection of a video file.
   * Ensures the video size is within the acceptable limit (500MB).
   * @param {Object} event - The event triggered by selecting a video file.
   */
  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 524288000) {
      toast.error('Video size must be less than 500MB');
      return;
    }
    setVideo(file);
  };

    /**
   * Handle the form submission to upload the video.
   * @param {Object} e - The form submission event.
   */
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!video) {
      toast.error('Please select a video first');
      return;
    }
    setUploading(true);
    const form = new FormData();

    // Append the form data (title, hashtags, and video)
    form.append("title", formData.title);
    form.append("hashtags", formData.hashtags);
    form.append("video", video);

    try {
      await uploadVideo(form);
      toast.success("Video uploaded successfully!");
      setUploading(false);
      navigate("/admin");
  } catch (err) {
      toast.error("Error uploading video");
      setUploading(false);
  } finally {
      setUploading(false); 
  }
  };

  return (
    <div className="container mx-auto p-4">
       {uploading && <Loader />}  {/* Show loader while uploading */}
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <form onSubmit={handleVideoUpload} className="mt-4">
        {/* Input for video title */}
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title}
          required
          className="border p-2 mb-2 w-full"
        />

         {/* Input for video hashtags */}
        <input
          type="text"
          name="hashtags"
          placeholder="Hashtags (comma separated)"
          onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
          value={formData.hashtags}
          className="border p-2 mb-2 w-full"
        />

        {/* Input for video file selection */}
        <input
         type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="border p-2 mb-2 w-full"
        />

        {/* Submit button for uploading the video */}
        <button type="submit" className="bg-blue-500 text-white p-2 w-full mt-2">
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
