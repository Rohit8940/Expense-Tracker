import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SideCop = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-64 h-screen bg-[#fffff] text-white p-6 flex flex-col">
      {/* Profile Section */}
      <div className="relative flex flex-col items-center mb-6">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <img
              src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-white object-cover"
            />
            <span className="text-sm">
              Hello, {user?.name?.split(" ")[0] || "Guest"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-md w-40 py-2 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-4 w-[89%]">
        {["Home","Reports", "About"].map((item, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={()=>navigate(`/${item}`)}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideCop;
