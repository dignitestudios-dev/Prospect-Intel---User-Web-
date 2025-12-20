import React, { useState } from 'react';
import { useNavigate } from "react-router"; // Use 'react-router-dom' for useNavigate


export default function SettingsPage() {
    const navigate = useNavigate(); 

  // State to track which section is active (Profile or Password)
  const [activeSection, setActiveSection] = useState('profile'); // Default is 'profile'

  // Handle section change (either Profile or Password)
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleRequestPasswordClick = () => {
    // Logic for requesting password change can be added here
    navigate("/auth/reset-password");
  }

  return (
    <div className="min-h-screen bg-[#E9EEF7] flex p-8">

      {/* LEFT SIDEBAR */}
      <div className="w-64 p-8 pt-0">
        
        <div className="text-gray-700 font-medium mb-10 text-[24px]">
         My Account
        </div>
        <div className="text-gray-700 font-medium mb-10">
          Davidschumate@gmail.com
        </div>

        <div className="space-y-3">
          {/* Profile Button with active state */}
          <button
            onClick={() => handleSectionChange('profile')}
            className={`w-[100px] text-left px-4 py-2 rounded-md shadow-sm border text-gray-700 font-medium ${
              activeSection === 'profile' ? 'bg-[#FAF8F2]' : 'shadow-none border-none'
            }`}
          >
            Profile
          </button>

          {/* Password Button with active state */}
          <button
            onClick={() => handleSectionChange('password')}
            className={`w-[100px] text-left px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 ${
              activeSection === 'password' ? 'bg-[#FAF8F2]' : 'shadow-none border-none'
            }`}
          >
            Password
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="flex-1 p-8 w-[980px] h-[533px]">
        <div className="p-10 shadow-sm bg-transparent bg-opacity-25 pt-8 rounded-xl border-2 border-white">

          {/* Conditional Rendering for Profile or Password */}
          {activeSection === 'password' ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
              <p className="text-gray-500 mb-6">
                To change your password, click the button below to request a password change.
              </p>

              <button className="bg-[#0085CA] text-white px-5 py-3 rounded-xl hover:opacity-90" onClick={handleRequestPasswordClick}>
                Request Password Change
              </button>
            </>
          ) : (
            <>
              {/* Profile Section */}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Profile</h2>
              <p className="text-gray-500">Change your email and username</p>

              <hr className="my-6 border-gray-200" />

              {/* FORM FIELDS */}
              <div className="grid grid-cols-2 gap-6">
                <div className="relative w-full">
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-4 pt-5 pb-3">
                    <label className="absolute left-4 top-2 text-gray-500 text-xs pointer-events-none">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="Davidschumate@gmail.com"
                      className="w-full bg-transparent focus:outline-none text-gray-800 pt-1"
                    />
                  </div>
                </div>

                <div className="relative w-full">
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-4 pt-5 pb-3">
                    <label className="absolute left-4 top-2 text-gray-500 text-xs pointer-events-none">
                      Username
                    </label>

                    <input
                      type="text"
                      defaultValue="David Schumate"
                      className="w-full bg-transparent focus:outline-none text-gray-800 pt-1"
                    />
                  </div>
                </div>

              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end mt-6">
                <button className="bg-[#0085CA] text-white px-5 py-3 rounded-xl hover:opacity-90">
                  Save
                </button>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* PHONE */}
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm mb-1">Phone</h3>
                <p className="text-gray-800">+1-212-456-7890</p>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* SUBSCRIPTION STATUS */}
              <div>
                <h3 className="text-gray-700 font-medium mb-1">Subscription Status</h3>

                <p className="text-[#0088DA] font-extrabold text-lg">
                  PRO Package
                  <span className="text-gray-500 font-normal text-sm ml-2">
                    (Ending on 20 December 2026)
                  </span>
                </p>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
