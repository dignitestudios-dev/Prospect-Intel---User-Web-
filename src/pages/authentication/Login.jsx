import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { useFormik } from "formik";
import { signInSchema } from "../../schema/authentication/LoginSchema";
import axiosinstance from "../../axios";
import { useAppDispatch } from "../../lib/store/hook";
import { login } from "../../lib/store/feature/authSlice";
import { resetFilters } from "../../lib/store/feature/filterSlice";
import { logActivity } from "../../lib/store/actions/activityActions";
import { TextField } from "../../ui/Field";
import Button from "../../ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // The sign-in records where you logged in from. Never let that lookup hold up sign-in.
  const getUserLocation = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch("https://ipinfo.io/json", { signal: controller.signal });
      const data = await res.json();
      return {
        city: data.city || "",
        state: data.region || "",
      };
    } catch {
      return { city: "", state: "" };
    } finally {
      clearTimeout(timer);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { city, state } = await getUserLocation();

        const payload = {
          email: values.email,
          password: values.password,
          role: "User",
          city,
          state,
        };

        const response = await axiosinstance.post("/user/login", payload);

        if (response.status === 200) {
          const data = response?.data?.data;

          dispatch(
            login({
              token: data?.token,
              user: data?.user,
            }),
          );
          dispatch(resetFilters());

          dispatch(
            logActivity({
              title: "User Logged In",
              description: "User Logged In",
              metaData: { type: "Logged In", city, state },
            }),
          );

          SuccessToast(response.data?.message || "Login Successful");
          try {
            sessionStorage.setItem("pi_splash", "1"); // dashboard shows the loading animation once
          } catch {
            /* storage unavailable: skip the animation */
          }
          navigate("/app/dashboard", { replace: true });
        }
      } catch (error) {
        ErrorToast(error?.response?.data?.message || "We couldn't sign you in. Check your email and password.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Sign in</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">Enter the email and password for your Prospect Intel account.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          size="lg"
          label="Email"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@program.edu"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email && touched.email ? errors.email : ""}
        />

        <TextField
          size="lg"
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password && touched.password ? errors.password : ""}
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

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          {loading ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
