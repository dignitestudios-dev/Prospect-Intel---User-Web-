import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineAccountCircle, MdOutlineStars } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Logo } from "../../assets/export"; // Assuming Logo is correctly imported
import { Star, User } from "lucide-react";

const DropdownModal = ({ username }) => (
    // Modal positioning is crucial. Absolute position relative to the parent.
    <div className="absolute right-4 mt-2 w-56 rounded-lg shadow-xl py-3 border border-gray-100 z-50  bg-[#EAEEF8]">
        
        {/* User Header Section */}
        <div className="flex items-center gap-2 px-4 pb-3 border-b border-gray-200">
            {/* Logo/Shield Icon Placeholder */}
            {/* The shield icon from the image is a bit custom, using a simple placeholder here */}
            <div className="w-8 h-8 flex items-center justify-center">
                {/* Assuming this is your logo or a specific shield icon */}
                {/* For demonstration, I'll use a placeholder or assume the logo can fit here smaller */}
                <img src={Logo} alt="Logo" className="h-full" />
            </div>
            <span className="text-base font-semibold text-gray-800">{username}</span>
        </div>

        {/* Account Divider */}
        <p className="text-xs font-medium text-gray-500 uppercase px-4 pt-3 pb-1">Account</p>

        {/* Navigation Items */}
        <div className="space-y-1">
            
            {/* My Account */}
            <a 
                href="/app/settings" 
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600">
                    <User className="text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-700">My Account</span>
            </a>

            {/* Saved Athletes */}
            <a 
                href="/app/saved" 
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600">
                    <Star className="text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-700">Saved Athletes</span>
            </a>

            {/* Log Out */}
            <a 
                href="/auth/login" 
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                {/* Note: The image shows the log out icon in red, so we style the icon container red. */}
                <div className="w-8 h-8 rounded-lg border border-red-400 bg-red-50 flex items-center justify-center text-red-500">
                    <IoIosLogOut className="text-xl" />
                </div>
                <span className="text-sm font-medium text-gray-700">Log Out</span>
            </a>
        </div>
    </div>
);


const DummyNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userName = "Daved Schumate"; // This would typically come from user context/props

  const handleDropdownClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full border-b border-gray-300 bg-[#EAEEF8] h-20 px-4  flex justify-between items-center">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <img
          src={Logo}
          loading="lazy"
          alt="logo-organization"
          className="h-10 cursor-pointer"
        />
        <div className="bg-white rounded-full p-1.5">
          <span className="text-sm font-semibold text-[#0085CA]">PRO</span>
          <span className="text-xs font-extralight text-gray-500 ml-2">Ending on 20 Dec 2026</span>
        </div>
      </div>

      {/* User Avatar and Profile Dropdown - IMPORTANT: Make this section relative for the absolute modal */}
      <div className="relative">
        <div 
            className="flex items-center ml-4 cursor-pointer"
            onClick={handleDropdownClick}
        >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold mr-2">
                DS
            </div>
            <span className="text-sm font-medium text-gray-800">My Account</span>
            <FaChevronDown 
                className={`text-gray-500 text-[10px] ml-2 transform transition-transform ${isModalOpen ? 'rotate-180' : 'rotate-0'}`} 
            />
        </div>

        {/* Dropdown Modal conditionally rendered */}
        {isModalOpen && <DropdownModal username={userName} />}
      </div>
    </div>
  );
};

export default DummyNavbar;