import React, { useState } from "react";
import { signup, login } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const Auth = () => {
  const navigate = useNavigate();
   // State variables to manage form inputs, loading state, and toggle between signup and login forms
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "", role: "user" });

   /**
   * Handle form submission (for both signup and login)
   * @param {Object} e - The event triggered by form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (isSignup) {
      // Handle signup logic
      try {
         await signup(formData);
        toast.success("User created. Now you can log in.");
        setIsSignup(false);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error creating account.";
        toast.error(errorMessage); 
        setLoading(false);
      }
    } else {
      // Handle login logic
      try {
        const { data } = await login(formData);
        localStorage.setItem("token", data.token);
        setLoading(false);
        navigate(data?.user?.role === "admin" ? "/admin" : "/dashboard");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Invalid credentials";
        toast.error(errorMessage); 
        setLoading(false);
      }
    }
    setLoading(false);
  };
  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {loading && <Loader />}
      <Link to="/" className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          {isSignup ? "Create your account" : "Sign in to your account"}
        </h2>
      </Link>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                value={formData.username}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                {!isSignup && (
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                value={formData.password}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Role Field for Signup */}
          {isSignup && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  required
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  value={formData.role}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>

        {/* Toggle between Login and Signup */}
        <p className="mt-10 text-center text-sm text-gray-500">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsSignup(false)} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Log in here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span onClick={() => setIsSignup(true)} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Sign up here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
