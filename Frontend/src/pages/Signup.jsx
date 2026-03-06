import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Must be at least 8 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulate API call
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/signup",
        {
          name: form.name,
          email: form.email,
          password: form.password
        },
        { withCredentials: true }
      );
      console.log("res->", response);
      if (response.status === 201) {
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.log("error while signing up-", error);
      setLoading(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-200 px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');`}</style>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-8 gap-6">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content text-lg font-bold shadow">
                  ✦
                </div>
              </div>
              <h1
                className="text-3xl text-base-content"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Create account
              </h1>
              <p className="text-base-content/50 text-sm">
                Sign up to get started today
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text text-xs font-medium text-base-content/70 uppercase tracking-widest">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.name ? "input-error" : ""}`}
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-error text-xs mt-0.5">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text text-xs font-medium text-base-content/70 uppercase tracking-widest">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.email ? "input-error" : ""}`}
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-error text-xs mt-0.5">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text text-xs font-medium text-base-content/70 uppercase tracking-widest">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.password ? "input-error" : ""}`}
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-error text-xs mt-0.5">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`btn btn-primary w-full mt-2 ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creating account…" : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-xs text-base-content/40 my-0">OR</div>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-2">
              <button className="btn btn-outline btn-sm gap-2 normal-case font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
              <button className="btn btn-outline btn-sm gap-2 normal-case font-medium">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <p className="text-center text-sm text-base-content/50">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="link link-primary font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
