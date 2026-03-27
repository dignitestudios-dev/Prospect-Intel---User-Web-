import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiLoader } from "react-icons/fi";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { signInSchema } from "../../schema/authentication/LoginSchema";
import axiosinstance from "../../axios";
import { useFormik } from "formik";


const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: { email: "" },
      validationSchema: signInSchema.pick(["email"]),
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const response = await axiosinstance.post("/user/otp/request", {
            email: values.email,
          });

          if (response.status === 200) {
            SuccessToast(response.data?.message || "Recovery link sent!");
            navigate("/auth/otp-verification");
            localStorage.setItem('email', values.email)
          }
        } catch (error) {
          ErrorToast(error?.response?.data?.message || "Something went wrong!");
        } finally {
          setLoading(false);
        }
      },
    });



  return (

    <div className="min-h-screen bg-[#EAEEF8] flex flex-col w-full">




      <main className="flex-grow flex items-center justify-center">

        <div className="w-full max-w-md flex flex-col items-center">



          <div className="w-full rounded-xl">


            <div>
              <h2 className="text-2xl font-extrabold text-center text-gray-800 ">
                Reset Password
              </h2>
              <p className="justify-center text-center mb-6 text-[#0D0C0C99]">Enter email to get password recovery link with 4 digit code</p>

            </div>



            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>


              <div className="w-full">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="w-full h-12 text-gray-900 bg-white bg-opacity-25 p-4 pt-4 border-2 border-white rounded-lg placeholder:text-gray-500 px-4 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Username/Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#0087C3] text-white flex gap-2 items-center justify-center text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 disabled:bg-blue-400"
                disabled={loading}
              >
                <span>Confirm</span>
                {loading && <FiLoader className="animate-spin text-lg" />}
              </button>
            </form>



          </div>

        </div>
      </main>

    </div>
  );
};

export default ForgotPassword;
