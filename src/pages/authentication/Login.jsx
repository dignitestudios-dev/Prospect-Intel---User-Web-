import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiLoader } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { prospectLogo } from "../../assets/export";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { useFormik } from "formik";
import { signInSchema } from "../../schema/authentication/LoginSchema";
import axiosinstance from "../../axios";
import { useAppDispatch } from "../../lib/store/hook";
import { login } from "../../lib/store/feature/authSlice";
import { logActivity } from "../../lib/store/actions/activityActions";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotClick = () => {
    navigate("/auth/forgot-password");
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axiosinstance.post("/user/login", {
          email: values.email,
          password: values.password,
          role: "User",
        });

        if (response.status === 200) {
          const data = response?.data?.data;

          dispatch(
            login({
              token: data?.token,
              user: data?.user,
            })
          );

          dispatch(
            logActivity({
              title: "User Logged In",
              description: "User Logged In",
              metaData: {
                type: "Logged In",
              }
            })
          );

          SuccessToast(response.data?.message || "Login Successful");
          navigate("/app/dashboard");
        }
      } catch (error) {
        ErrorToast(
          error?.response?.data?.message || "Login failed. Try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#EAEEF8] flex flex-col w-full">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-8">
            <img src={prospectLogo} alt="Logo" />
          </div>

          <div className="w-full rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>


              <div>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-12 border rounded-lg px-4"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>


              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-12 border rounded-lg px-4"
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-4"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>

                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>


              {/* <button
                type="button"
                onClick={handleForgotClick}
                className="text-sm text-blue-500 text-left"
              >
                Forgot Password?
              </button>
 */}

              <button
                type="submit"
                className="h-12 bg-blue-600 text-white rounded-lg flex justify-center items-center"
                disabled={loading}
              >
                {loading ? <FiLoader className="animate-spin" /> : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;