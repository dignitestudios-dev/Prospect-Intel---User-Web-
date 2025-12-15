import React, { useState } from "react"; 
import { useNavigate } from "react-router"; 
import { FiLoader } from "react-icons/fi"; 
import { ErrorToast } from "../../components/global/Toaster"; 
import { Logo } from "../../assets/export"; 
import axios from "../../axios"; 

const Verification = () => {
  const navigate = useNavigate(); 

  // State to store the OTP as an array of 4 digits
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false); 
  const [otpError, setOtpError] = useState(""); 

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") { // Only allow single digit or empty
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input when current one is filled
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle focus on previous input when backspace is pressed
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  // Handle OTP verification (replace with actual API call)
  const handleVerifyOtp = async () => {
    setOtpError("");
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      // Replace with actual OTP verification API call
      const response = await axios.post("/verify-otp", { otp: otpString });
      
      if (response.data.success) {
        navigate("/app/dashboard"); // Navigate to dashboard after successful verification
      } else {
        ErrorToast(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      ErrorToast("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   const handleClick = () => { 
    navigate("/auth/reset-password");
  };

  return (
    <div className="min-h-screen bg-[#EAEEF8] flex flex-col w-full">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center">
        {/* Centered Content Container */}
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Logo (Optional) */}
          {/* <div className="mb-8">
            <img 
              src={Logo} 
              alt="Prospect Intel Logo" 
              className="h-auto w-auto" 
            />
          </div> */}

          {/* OTP Form Wrapper */}
          <div className="w-full rounded-xl p-6 ">
            
            {/* OTP Verification Title */}
            <h2 className="text-md font-normal text-center text-gray-800 mb-6">
Enter the 4 digit code send to dav*********.com            </h2>

            {/* OTP Input Form */}
            <form className="w-full flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
              
              {/* OTP Input with individual squares */}
              <div className="w-full flex justify-between gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-24 h-16 text-center text-2xl font-bold bg-white bg-opacity-25 p-4 pt-4 border-2 border-white  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="-"
                  />
                ))}
              </div>
              {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}

              {/* Verify OTP Button */}
              <button
                type="submit"
                className="w-md h-12 bg-[#0087C3] text-white flex gap-2 items-center justify-center text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 disabled:bg-blue-400"
                disabled={loading}
                onClick={handleClick}
              >
                <span>Verify OTP</span>
                {loading && <FiLoader className="animate-spin text-lg" />}
              </button>
            </form>

            {/* Optionally you can add a resend OTP link */}
            <div className="text-center mt-4">
              <button 
                className="text-sm text-blue-500 hover:underline"
                onClick={() => { /* Resend OTP logic here */ }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verification;
