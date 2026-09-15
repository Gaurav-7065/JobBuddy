import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

const LoginPage = () => {
  const { handleLogin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleLogin({
      email,
      password,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090b0f] text-white px-4 py-10">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-[-200px] h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[120px]" />

        <div className="absolute right-1/4 top-[-150px] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">

        {/* Login Container */}
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8 text-center">

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-4 py-1.5 text-xs font-medium text-pink-400">
              <span>✦</span>
              AI Interview Preparation
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome{" "}
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                Back
              </span>
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Login to continue your interview preparation.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-700/70 bg-[#11151a]/95 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-700
                             bg-[#1b2028] px-4 py-3.5 text-sm
                             text-gray-200 placeholder:text-gray-600
                             outline-none transition
                             focus:border-pink-500/60
                             focus:ring-2 focus:ring-pink-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-700
                             bg-[#1b2028] px-4 py-3.5 text-sm
                             text-gray-200 placeholder:text-gray-600
                             outline-none transition
                             focus:border-pink-500/60
                             focus:ring-2 focus:ring-pink-500/10"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-pink-400 transition
                             hover:text-pink-300 hover:cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full items-center justify-center
                            gap-2 rounded-xl py-3.5 text-sm font-semibold
                            text-white transition duration-200
                            ${
                              loading
                                ? "cursor-not-allowed bg-gray-700 text-gray-500"
                                : "cursor-pointer bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 shadow-lg shadow-pink-500/20 hover:-translate-y-0.5 hover:shadow-pink-500/30 active:scale-[0.98]"
                            }`}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>→</span>
                    Login
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-700" />

              <span className="text-xs text-gray-600">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-700" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-pink-400 transition hover:text-pink-300"
              >
                Create Account
              </Link>
            </p>

          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-[11px] text-gray-600">
            Prepare smarter. Interview with confidence.
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;