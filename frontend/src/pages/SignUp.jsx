import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>

      {/* Top Navbar */}
      <div className="absolute top-6 left-10 flex items-center space-x-2">
        <div className="text-2xl font-bold text-gray-700">🟢 Expense Tracker</div>
      </div>

      <div className="absolute top-6 right-10">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-green-600 font-semibold hover:underline"
        >
          Log in
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600">
          Sign up
        </button>
      </div>

      {/* Signup Card */}
      <div className="bg-white shadow-2xl rounded-lg w-[40%] px-8 py-10 flex flex-col gap-6 items-center">
        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-700 text-center">Sign Up</h3>

        {/* Error / Success Messages */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSignUp} className="w-[70%] flex flex-col gap-5">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* reCAPTCHA Placeholder */}
          <div className="flex items-center justify-center border px-6 py-4 rounded-md bg-gray-100 text-gray-500">
            ⏳ I'm not a robot (reCAPTCHA)
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
