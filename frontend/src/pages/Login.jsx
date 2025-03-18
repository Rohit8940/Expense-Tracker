  import React, { useState } from "react";
  import {useNavigate } from "react-router-dom";
  import SignUp from "./SignUp";
  import axios from "axios";

  const Login = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const handleLogin = async (e) => {
      e.preventDefault();
      setError(""); // Clear previous errors
      try {
          const res = await axios.post("http://localhost:5000/api/auth/login", {
              email,
              password
          });

          console.log("Login Response:", res.data); // 🔴 Debug API response

          if (!res.data.token) {
              throw new Error("No token received!");
          }
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("userId", res.data.user._id); 

          navigate("/");
      } catch (error) {
          console.error("Login Error:", error.response ? error.response.data : error.message);
          setError("Invalid Email or Password");
      }
  };

    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50 relative">
        {/* Background Pattern (Fix: pointer-events-none) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>

        {/* Top Navbar */}
        <div className="absolute top-6 left-10 flex items-center space-x-2">
          <div className="text-2xl font-bold text-gray-700">🟢 Expense Tracker</div>
        </div>

        <div className="absolute top-6 right-10">
          <button className="px-4 py-2 text-green-600 font-semibold hover:underline">
            Log in
          </button>
          <button onClick={()=> navigate("/SignUp")}
          className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600">
            Sign up
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white-10 shadow-2xl rounded-lg w-[40%] px-8 py-10 flex flex-col gap-8 space-y-6 relative items-center">
          {/* Title */}
          <h3 className="text-2xl font-semibold text-gray-700 text-center">Log in</h3>

          {error && <p className="text-red-500">{error} </p>}

          {/* Form */}
          <form onSubmit={handleLogin} className="w-[70%] flex flex-col space-y-5 gap-5 items-center">
            {/* Email Input */}
            <input
              type="email"
              value={email}
              placeholder="Email address"
              className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e)=> setEmail(e.target.value)}
              required
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e)=> setPassword(e.target.value)}
              required
            />

            {/* reCAPTCHA Placeholder */}
            <div className="flex items-center justify-center border px-6 py-4 rounded-md bg-gray-100 text-gray-500">
              ⏳ I'm not a robot (reCAPTCHA)
            </div>

            {/* Login Button */}
            <button 
            type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition cursor-pointer">
              Log in
            </button>
          </form>

          {/* Forgot Password & Signup Links */}
          <div className="text-center">
            <a href="#" className="text-green-600 hover:underline text-sm">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    );
  };

  export default Login;
