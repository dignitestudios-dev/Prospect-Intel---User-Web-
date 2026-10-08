import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import axios from "../../axios";
import Cookies from "js-cookie";
import { ErrorToast } from "../../components/global/Toaster";
import { TextField } from "../../ui/Field";
import Button from "../../ui/Button";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email || !password) {
      ErrorToast("Enter both your email and a new password.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Use at least 8 characters.");
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
        ErrorToast(response.data.message || "Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      ErrorToast("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">New password</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">Choose a password with at least 8 characters.</p>

      <form
        className="mt-6 space-y-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <TextField
          size="lg"
          label="Email"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="you@program.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <TextField
          size="lg"
          label="New password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          }
        />
        <Button type="submit" variant="primary" size="lg" loading={loading} onClick={handleLoginClick} className="w-full">
          Save and sign in
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
