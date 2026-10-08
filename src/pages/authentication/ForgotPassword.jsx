import { useState } from "react";
import { useNavigate } from "react-router";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { signInSchema } from "../../schema/authentication/LoginSchema";
import axiosinstance from "../../axios";
import { useFormik } from "formik";
import { TextField } from "../../ui/Field";
import Button from "../../ui/Button";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
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
          navigate("/auth/verification");
          localStorage.setItem("email", values.email);
        }
      } catch (error) {
        ErrorToast(error?.response?.data?.message || "Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Reset password</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">Enter your email and we&apos;ll send a 4-digit code.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          size="lg"
          label="Email"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="you@program.edu"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email && touched.email ? errors.email : ""}
        />
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          Send code
        </Button>
        <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => navigate("/auth/login")}>
          Back to sign in
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
