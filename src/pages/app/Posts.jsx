import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaComment,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const Posts = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Nichole Micheal",
      profile: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      description:
        "Lorem Ipsum Dollar sit amet consectetur. Congue praesent in auctor mauris facilisis...",
      likes: 10100,
      comments: 123,
    },
    {
      id: 2,
      user: "John Smith",
      profile: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
      image:
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800",
      description:
        "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus...",
      likes: 8700,
      comments: 95,
    },
    {
      id: 3,
      user: "Sarah Lee",
      profile: "https://cdn-icons-png.flaticon.com/512/219/219986.png",
      image:
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800",
      description:
        "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem...",
      likes: 12000,
      comments: 200,
    },
  ]);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [modal, setModal] = useState({ type: null, postId: null });

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest("[data-menu-toggle]")) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const openModal = (type, postId) => {
    setModal({ type, postId });
    setMenuOpenId(null);
  };

  const closeModal = () => {
    setModal({ type: null, postId: null });
  };

  const handleDelete = () => {
    setPosts(posts.filter((post) => post.id !== modal.postId));
    closeModal();
  };

  const handleEdit = () => {
    alert(`Edit post ${modal.postId}`);
    closeModal();
  };

  const currentPost = posts.find((post) => post.id === modal.postId);

  return (
    <div className="p-6 text-white min-h-screen pt-0">
      <div className="background-gradients relative p-6 rounded-xl text-white shadow-md border-2 border-gray-700 overflow-hidden mt-4">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 button-bg rounded-t-3xl" />

        {/* Title + Icon */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] md:text-[36px] font-bold">Community Management</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="background-gradient cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#DAB462] transition-all relative"
            onClick={() => openModal("view", post.id)}  // Open view modal on click
          >
            {/* User Info */}
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.profile}
                  alt={post.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-semibold">{post.user}</p>
              </div>

              {/* 3 dots menu */}
              <div className="relative">
                {/* <button
                  data-menu-toggle
                  onClick={() => openMenu(post.id)}
                  className="p-2 rounded-full hover:bg-[#DAB462]/20 transition"
                  title="Options"
                >
                  <FaEllipsisV className="text-white" />
                </button> */}

                {/* Dropdown */}
                {/* {menuOpenId === post.id && (
                  <div className="absolute right-0 mt-2 w-28 bg-[#1F2937]/90 border border-gray-700 rounded-lg shadow-lg z-50 backdrop-blur-md">
                    <button
                      data-menu-toggle
                      onClick={() => openModal("edit", post.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm w-full text-white hover:bg-gray-700 rounded-t-lg"
                    >
                      Edit
                    </button>
                    <button
                      data-menu-toggle
                      onClick={() => openModal("delete", post.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm w-full text-white hover:bg-gray-700 rounded-b-lg"
                    >
                      Delete
                    </button>
                  </div>
                )} */}
              </div>
            </div>

            {/* Image */}
            <div className="mt-3">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-60 object-cover rounded-t-lg"
              />
            </div>

            {/* Description */}
            <div className="p-4">
              <p className="text-sm text-gray-300 mb-3">{post.description}</p>

              {/* Likes & Comments */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <FaHeart className="text-red-500" />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaComment className="text-gray-400" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.type && currentPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4">
          <div className="background-gradient border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-lg text-white relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* View Modal */}
            {modal.type === "view" && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Post Details</h2>

                {/* Post Content */}
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <img
                      src={currentPost.profile}
                      alt={currentPost.user}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <p className="text-lg font-semibold">{currentPost.user}</p>
                  </div>

                  {/* Post Image */}
                  <img
                    src={currentPost.image}
                    alt="Post Image"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4">{currentPost.description}</p>

                  {/* Likes & Comments */}
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <FaHeart className="text-red-500" />
                      <span>{currentPost.likes.toLocaleString()} Likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaComment />
                      <span>{currentPost.comments} Comments</span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => openModal("edit", currentPost.id)}
                    className="px-6 flex py-2  items-center rounded-xl border border-gray-700 hover:border-[#DAB462] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openModal("delete", currentPost.id)}
                    className="px-6 flex items-center  py-2 rounded-xl  font-semibold border hover:border-[#DAB462] border-gray-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            {/* Edit Modal */}
            {modal.type === "edit" && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
                <p>Editing post ID: {modal.postId}</p>
                {/* Add form inputs for editing here */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-gray-600 hover:border-[#DAB462] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 rounded-xl button-bg text-black font-semibold hover:bg-[#b8860b] transition"
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {/* Delete Modal */}
            {modal.type === "delete" && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-red-500">Delete Post</h2>
                <p>Are you sure you want to delete this post?</p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-gray-600 hover:border-red-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-xl bg-red-500 font-semibold hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
