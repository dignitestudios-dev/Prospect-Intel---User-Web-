import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ErrorToast } from "../../components/global/Toaster";
import axios from "../../axios";
import Button from "../../ui/Button";

const Verification = () => {
  const navigate = useNavigate();
  const inputs = useRef([]);

  // The 4-digit code, one box per digit
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const focusBox = (i) => inputs.current[i]?.focus();

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) focusBox(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) focusBox(index - 1);
  };

  // Pasting a full code fills every box
  const handlePaste = (e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    if (digits.length === 0) return;
    e.preventDefault();
    const next = ["", "", "", ""];
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    focusBox(Math.min(digits.length, 3));
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      setOtpError("Enter all 4 digits of the code.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/verify-otp", { otp: otpString });

      if (response.data.success) {
        navigate("/app/dashboard");
      } else {
        ErrorToast(response.data.message || "That code didn't work. Try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      ErrorToast("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/auth/reset-password");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Enter your code</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">We sent a 4-digit code to your email.</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyOtp();
        }}
      >
        <fieldset>
          <legend className="sr-only">4-digit code</legend>
          <div className="flex gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-label={`Digit ${index + 1}`}
                aria-invalid={otpError ? true : undefined}
                className="h-12 w-full min-w-0 rounded-md border border-ink-200 bg-white text-center text-xl font-semibold text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
              />
            ))}
          </div>
        </fieldset>
        {otpError && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {otpError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          onClick={handleClick}
          className="mt-6 w-full"
        >
          Verify code
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="rounded text-[13px] font-medium text-signal-700 hover:underline"
          onClick={() => {
            /* Resend OTP logic here */
          }}
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

export default Verification;
