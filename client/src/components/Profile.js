import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";
import { toast } from "react-toastify";
import Loader from "./Loader";

/**
 * Profile component: Displays and manages user profile information.
 */
const Profile = () => {
  // State to store user profile information
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    bio: "",
    location: "",
    avatarUrl: "",
  });
  const [editMode, setEditMode] = useState(false);
  // State to store form data when editing the profile
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    location: "",
    avatarFile: null, 
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

   /**
   * Fetch the user profile data from the server when the component mounts.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await getUserProfile();
         // Set profile data and initialize form fields with fetched data
        setProfile(data);
        setFormData({
          username: data.username,
          email: data.email,
          password: "",
          bio: data.bio || "",
          location: data.location || "",
          avatarFile: null,
        });
        setAvatarPreview(data?.avatarUrl);
        setLoading(false); 
      } catch (error) {
        toast.error("Error fetching profile data.");
        setLoading(false); 
      } finally {
        setLoading(false); 
      }
    };

    fetchProfile();
  }, []);

   /**
   * Handle avatar file change event.
   * @param {Object} e - The file input change event
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatarFile: file });
      setAvatarPreview(URL.createObjectURL(file)); // Show preview of the uploaded image
    }
  };

    /**
   * Handle form submission to update the user's profile.
   * @param {Object} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("username", formData.username);
    formDataToSubmit.append("email", formData.email);
    if (formData.password) formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("bio", formData.bio);
    formDataToSubmit.append("location", formData.location);
    if (formData.avatarFile) formDataToSubmit.append("file", formData.avatarFile);

    try {
      await updateUserProfile(formDataToSubmit);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setProfile((prev) => ({
        ...prev,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        avatarUrl: avatarPreview,
      }));
      setLoading(false);
    } catch (error) {
      toast.error("Error updating profile.");
      setLoading(false);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-8">
      {loading && <Loader />}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarPreview || profile.avatarUrl} // Show avatar preview or current avatar
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full mb-4 border-4 border-gray-200 object-cover"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{profile.username}</h2>
          <p className="text-lg text-gray-600 mb-4">{profile?.email}</p>
          <p className="text-sm text-gray-500 mb-2">Role: <span className="text-gray-700">{profile?.role}</span></p>
          <p className="text-sm text-gray-500 mb-2">Location: <span className="text-gray-700">{profile.location || "Not specified"}</span></p>
          <p className="text-sm text-gray-500 mb-4">Bio: <span className="text-gray-700">{profile.bio || "No bio available."}</span></p>
        </div>
        {!editMode ? (
          <div className="text-center">
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password (Leave blank to keep current password)
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows="3"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;