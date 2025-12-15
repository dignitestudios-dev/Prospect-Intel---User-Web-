import React, { useState } from "react";
import { useNavigate } from "react-router"; // Use 'react-router-dom' for useNavigate
import { FiLoader } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
// Assuming Logo is the dark 'PROSPECT INTEL' logo from the image
import { Logo } from "../../assets/export"; 
import axios from "../../axios"; 
import Cookies from "js-cookie";
import { ErrorToast } from "../../components/global/Toaster"; 
import DummyNavbar from "../../components/layout/DummyNavbar";

// The 'login' import seems unused in the logic, keeping it for completeness if needed elsewhere
// import { login } from "../../assets/export"; 

const ForgotPassword = () => {
  const navigate = useNavigate(); 

  // State for managing form fields and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [emailError, setEmailError] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 

  // Handle input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleForgotClick = () => {
    navigate("/auth/forgot-password");
  };

  // Keep original logic for navigating to dashboard (you can adjust this as needed)
  const handleLoginClick = () => { 
    navigate("/auth/verification");
  };

  // Original handleLogin function logic remains
  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email || !password) {
      ErrorToast("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/admin/login", { email, password });

      if (response.data.success) {
        Cookies.set("token", response.data.data.token);
        Cookies.set("user", JSON.stringify(response.data.data.admin));
        navigate("/app/dashboard");
      } else {
        ErrorToast(response.data.message || "An unknown error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      ErrorToast("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    // Outer container for the whole page with light blue/gray background
    <div className="min-h-screen bg-[#EAEEF8] flex flex-col w-full">
      
      {/* 1. Header Bar */}

      {/* <header className="w-full bg-white shadow-sm">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          
          <div className="flex-shrink-0">
            <img 
              src={Logo} 
              alt="Prospect Intel Logo" 
              className="h-8 w-auto" 
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => {  }}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              Contact Us
            </button>
            <button
              onClick={() => {  }}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow hover:bg-gray-900 transition duration-150"
            >
              Get Started
            </button>
          </div>
        </div>
      </header> */}

      {/* 2. Main Content Area (Centered Login Form) */}
      <main className="flex-grow flex items-center justify-center">
        {/* Container for the centered content (Logo and Form) */}
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Large Centered Logo */}
          {/* <div className="mb-8">
            <img 
              src={Logo} 
              alt="Prospect Intel Logo Large" 
              className="h-auto w-auto" 
            />
          </div> */}

          {/* Login Form Wrapper */}
          <div className="w-full rounded-xl">
            
            {/* Log In Title */}
            <div>
            <h2 className="text-2xl font-extrabold text-center text-gray-800 ">
              Reset Password
            </h2>
                        <p className="justify-center text-center mb-6 text-[#0D0C0C99]">Enter email to get password recovery link with 4 digit code</p>

</div>
            {/* Form */}
            {/* The form structure below matches the desired look of inputs, 
                replacing the old translucent/background-image style. */}
            <form className="w-full flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>

              {/* Username/Email Input */}
              <div className="w-full">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="w-full h-12 text-gray-900 bg-white bg-opacity-25 p-4 pt-4 border-2 border-white rounded-lg placeholder:text-gray-500 px-4 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Username/Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              {/* Password Input with Toggle */}
           

              {/* Forgot Password Link (Styled to be smaller and centered) */}
              {/* <div className="w-full flex justify-start">
                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-sm font-semibold hover:underline text-[#0087C3] "
                >
                  Forgot Password?
                </button>
              </div> */}

              {/* Log In Button (Primary Blue) */}
              <button
                type="submit"
                onClick={handleLoginClick} // You might want to use handleLogin for actual API call
                className="w-full h-12 bg-[#0087C3] text-white flex gap-2 items-center justify-center text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 disabled:bg-blue-400"
                disabled={loading}
              >
                <span>Confirm</span>
                {loading && <FiLoader className="animate-spin text-lg" />}
              </button>
            </form>
            
            {/* Terms & Privacy Links */}
          
          </div> {/* End of Form Wrapper */}

        </div> {/* End of Centered Content Container */}
      </main>

    </div>
  );
};

export default ForgotPassword;
