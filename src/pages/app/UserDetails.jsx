import React from "react";
import { FaChevronLeft, FaEdit, FaTrash, FaRegEdit, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";

const UserDetails = () => {
  const navigate = useNavigate();

  // Static user data
  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    maritalStatus: "Married",
    gender: "Male",
    dateOfBirth: "1985-10-15",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    signupDate: "Oct 10, 2025",
    status: "Active",
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleEdit = () => {
    alert("Edit user details");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      alert("User deleted");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="background-gradients relative p-6 rounded-xl text-white shadow-md border border-gray-700 overflow-hidden mt-4">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 button-bg rounded-t-3xl" />

        {/* Title + Icon */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] md:text-[36px] font-bold">User Details</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="background-gradients border border-gray-700 p-10 rounded-xl mt-6 w-full space-y-8">
        {/* User Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
          <img
            src={user.profileImage}
            alt="User Profile"
            className="w-40 h-40 rounded-full object-cover shadow-lg"
          />
          <div className="text-white ">
            <p className="text-4xl font-semibold">{user.name}</p>
            <p className="text-xl text-gray-300 mb-2">{user.email}</p>
            {/* <p className="text-sm text-gray-400">Joined: {user.signupDate}</p>*/}
            <span className="text-green-400 bg-green-800 bg-opacity-30 px-4 py-2  rounded-full text-xs">
              {user.status}
            </span> 
          </div>
        </div>

        {/* Detailed Information - Now in Separate Containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Email */}
          <div className="border border-gray-700 background-gradient p-6 rounded-lg">
            <p className="text-lg text-gray-300 font-semibold">Email:</p>
            <p className="text-lg text-white">{user.email}</p>
          </div>

          {/* Status */}
          <div className="border border-gray-700 background-gradient p-6 rounded-lg">
            <p className="text-lg text-gray-300 font-semibold">Status:</p>
            <p className="text-lg text-white">{user.status}</p>
          </div>

          {/* Joined Date */}
          <div className="border border-gray-700 background-gradient p-6 rounded-lg">
            <p className="text-lg text-gray-300 font-semibold">Joined:</p>
            <p className="text-lg text-white">{user.signupDate}</p>
          </div>

          {/* Gender */}
          <div className="border border-gray-700 background-gradient p-6 rounded-lg">
            <p className="text-lg text-gray-300 font-semibold">Gender:</p>
            <p className="text-lg text-white">{user.gender}</p>
          </div>

          {/* Marital Status */}
          <div className="border border-gray-700 background-gradient p-6 rounded-lg">
            <p className="text-lg text-gray-300 font-semibold">Marital Status:</p>
            <p className="text-lg text-white">{user.maritalStatus}</p>
          </div>

          {/* Date of Birth */}
          <div className="border border-gray-700 background-gradient p-6 rounded-lg">
            <p className="text-lg text-gray-300 font-semibold">Date of Birth:</p>
            <p className="text-lg text-white">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center space-x-6">
          <button
            onClick={handleEdit}
            className="px-8 py-3 rounded-xl border border-gray-600 hover:border-[#DAB462] transition text-white flex items-center space-x-3"
          >
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-8 py-3 rounded-xl bg-red-500 font-semibold hover:bg-red-600 transition text-white flex items-center space-x-3"
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
