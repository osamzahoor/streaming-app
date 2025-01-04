import React, { useState, useEffect } from "react";
import { addComment, getVideos } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Loader from "./Loader";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Feed", href: "/list", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "/" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const { data } = await getVideos();
        setVideos(data);
      } catch (error) {
        toast.error("Error fetching videos:", error.message);
        setLoading(false);
      } finally {
        setLoading(false); 
      }
    };

    fetchVideos();
  }, []);

   /**
   * Handle adding a comment for a specific video
   * @param {string} videoId - The ID of the video being commented on
   * @param {string} comment - The comment content
   */
  const handleAddComment = async (videoId, comment) => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const payload = { videoId, comment };
      await addComment(payload);

      // Update comments locally after successful API call
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video?._id === videoId
            ? {
                ...video,
                comments: [...video?.comments, { comment, userId: { username: "You" } }],
              }
            : video
        )
      );
      toast.success("Comment added successfully!");
      setLoading(false);
    } catch (error) {
      toast.error("Error adding comment:", error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

    // Handle user sign-out (removes token and navigates to login page)
   const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("You have been signed out.");
  };

  // Filter videos based on the search query (matches against title and hashtags)
  const filteredVideos = videos.filter(
    (video) =>
      video?.title.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      video?.hashtags.toLowerCase()?.includes(searchQuery.toLowerCase())
  );
  return (
    <>
      {loading && <Loader />}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="shrink-0">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-8"
                  />
                </Link>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt=""
                          src={ user.imageUrl}
                          className="h-8 w-8 rounded-full"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {item.name === "Sign out" ? (
                            <button
                              onClick={handleSignOut}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item?.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full rounded-md px-2 py-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.length > 0 ? (
              filteredVideos?.map((video) => (
                <div
                  key={video?._id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{video?.title}</h3>
                    <video
                      controls
                      className="mt-4 w-full rounded-md"
                      src={video?.url}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <p className="mt-2 text-sm text-gray-600">
                       {video?.hashtags}
                    </p>
                    <Link
                      to={`/video/${video?._id}`}
                      className="text-blue-500 text-sm"
                    >
                      View More
                    </Link>
                  </div>
                  <div className="border-t p-4">
                  <h4 className="text-md font-semibold">Comments</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600">
                      {video?.comments?.map((comment, index) => (
                        <li key={index} className="border-b pb-1">
                          <strong>{comment?.userId?.username || "Anonymous"}:</strong> {comment?.comment}
                        </li>
                      ))}
                    </ul>
                    <form
                      className="mt-4 flex"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const comment = e.target.comment.value;
                        handleAddComment(video._id, comment);
                        e.target.comment.value = "";
                      }}
                    >
                      <input
                        type="text"
                        name="comment"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Add a comment"
                      />
                      <button
                        type="submit"
                        className="ml-2 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-500"
                      >
                       {loading ? "Posting..." : "Post"}
                      </button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <h2 className="text-xl font-semibold">No Data Found</h2>
                  <p className="mt-2 text-gray-600">No videos match your search criteria.</p>
                </div>
              </div>
            )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
