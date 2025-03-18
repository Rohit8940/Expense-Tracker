import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "₹");
  const [budget, setBudget] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  // ✅ Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  // ✅ Update User Profile
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/user/update",
        { name: user.name, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Profile Updated!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  // ✅ Handle Currency Change
  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    localStorage.setItem("currency", selectedCurrency);
  };

  // ✅ Save Budget
  const saveBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/budget",
        { amount: budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Budget updated!");
    } catch (error) {
      console.error("❌ Error updating budget:", error);
    }
  };

  // ✅ Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <div className={`flex flex-col items-center min-h-screen p-5 transition duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-[#f2f2f2]"}`}>
      <h2 className="text-3xl font-bold mb-5">🔧 Settings</h2>

      {/* Profile */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold">👤 Profile</h3>
        <input
          type="text"
          className="w-full p-2 mt-2 border rounded-md"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          className="w-full p-2 mt-2 border rounded-md"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 w-full"
          onClick={updateProfile}
        >
          Update Profile
        </button>
      </div>

      {/* Currency Selection */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-lg mt-4">
        <h3 className="text-xl font-semibold">💰 Preferred Currency</h3>
        <select
          className="mt-2 p-2 border rounded-lg w-full"
          value={currency}
          onChange={handleCurrencyChange}
        >
          <option value="₹">₹ - Indian Rupee</option>
          <option value="$">$ - US Dollar</option>
          <option value="€">€ - Euro</option>
        </select>
      </div>

      {/* Budget Setting */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-lg mt-4">
        <h3 className="text-xl font-semibold">🎯 Monthly Budget</h3>
        <input
          type="number"
          className="mt-2 p-2 border rounded-lg w-full"
          placeholder="Enter budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 w-full"
          onClick={saveBudget}
        >
          Save Budget
        </button>
      </div>

      {/* Dark Mode */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-lg mt-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">🌙 Dark Mode</h3>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <div className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${darkMode ? "bg-black" : ""}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${darkMode ? "translate-x-6" : ""}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Settings;
