import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router";

const Users = () => {
  const navigate = useNavigate();
  
  // State for managing loading state
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Simulate data load after 2 seconds
    }, 2000);
  }, []);


  const handleViewClick = () => {
    // Navigate to the /app/user-details page
    navigate('/app/user-details');
  };

  return (
    <div className="p-6 min-h-screen pt-2 ">
      <div className="background-gradients relative p-6 rounded-xl text-white shadow-md border border-gray-700 overflow-hidden mt-4">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 button-bg rounded-t-3xl" />

        {/* Title + Icon */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] md:text-[36px] font-bold">Users Management</h1>
        </div>
      </div>

      <div className="mb-4 background-gradients border border-gray-700 p-6 rounded-xl mt-6">
        <div className="flex justify-between items-center mb-6">
          {/* <button onClick={handleViewAll} className="text-sm text-[#DAB462] hover:underline transition">View All</button> */}
        </div>

        <div className="w-full rounded-xl overflow-x-auto space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 text-left text-sm font-semibold text-gray-300 border-b border-gray-600 pb-4">
            <div className="px-4">#</div>
            <div>Name</div>
            <div>Email</div>
            <div>Signup Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-6 gap-4 items-center text-sm text-gray-200 bg-gray-800 bg-opacity-40 p-4 rounded-lg hover:bg-opacity-60 transition"
                  >
                    {/* Shimmer Effect */}
                    <div className="w-8 h-6 bg-gray-700 animate-pulse rounded-lg"></div>
                    <div className="w-24 h-6 bg-gray-700 animate-pulse rounded-lg"></div>
                    <div className="w-40 h-6 bg-gray-700 animate-pulse rounded-lg"></div>
                    <div className="w-24 h-6 bg-gray-700 animate-pulse rounded-lg"></div>
                    <div className="w-32 h-6 bg-gray-700 animate-pulse rounded-lg"></div>
                    <div className="w-20 h-6 bg-gray-700 animate-pulse rounded-lg"></div>
                  </div>
                ))
            : Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-6 gap-4 items-center text-sm text-gray-200 bg-gray-800 bg-opacity-40 p-4 rounded-lg hover:bg-opacity-60 transition"
                  >
                    <div className="font-medium text-gray-300">{idx + 1}</div>
                    <div className="font-semibold">John Doe</div>
                    <div className="text-sm opacity-80 truncate font-semibold">
                      john{idx}@example.com
                    </div>
                    <div className="text-sm">Oct {10 + idx}, 2025</div>
                    <div>
                      <span className="text-green-400 bg-green-800 bg-opacity-30 px-3 py-1 rounded-full text-xs">
                        Active
                      </span>
                    </div>
                    <div>
                      <button onClick={handleViewClick} className="text-white  background-gradient p-2 cursor-pointer items-center flex bg-opacity-80 hover:bg-gray-800  rounded-full hover:bg-opacity-100 transition">
                        <FaEye className="w-4 h-4 mr-2 text-[#DAB462]" /> View Details

                      </button>
                    </div>
                  </div>
                ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end mt-8 space-x-2">
          {/* Previous Button */}
          <button
            className="p-2 rounded-full border border-gray-700 text-gray-300 hover:bg-[#BE8B36] hover:text-white transition"
            aria-label="Previous Page"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {[1, 2, 3, 4, 5].map((page, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-xl border border-gray-700 text-sm transition ${
                page === 1
                  ? "bg-[#BE8B36] text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            className="p-2 rounded-full border border-gray-700 text-gray-300 hover:bg-[#BE8B36] hover:text-white transition"
            aria-label="Next Page"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
