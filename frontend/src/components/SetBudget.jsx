import React, { useState } from "react";
import axios from "axios";

const SetBudget = ({ onSave }) => {
  const [budgetInput, setBudgetInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSetBudget = async () => {
    if (!budgetInput || isNaN(budgetInput)) {
      alert("Please enter a valid budget amount");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))?._id; 

    if (!token || !userId) {
      console.error("🚨 No user ID or token found");
      alert("You must be logged in to set a budget.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/budget/${userId}`, // ✅ Send user-specific budget
        { amount: Number(budgetInput) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Budget Saved:", response.data);

      onSave(response.data.amount); // ✅ Update UI with saved budget
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error saving budget:", error.message);
      alert("Failed to save budget. Try again.");
    }
  };

  return (
    <>
      {/* 🎯 Button to Open Modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white  px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition"
      >
        🎯 Set Budget
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center 
            backdrop-blur-sm bg-black/30"
        >
          <div className="bg-black rounded-lg shadow-xl p-6 w-[90%] max-w-md h-[250px] flex flex-col justify-evenly items-center">
            {/* Modal Header */}
            <h2 className="text-2xl font-bold  text-center mb-4 text-white">
              Set Your Monthly Budget
            </h2>

            {/* Input Field */}
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-[65%] border p-3 rounded-md text-lg text-white outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Budget"
            />

            {/* Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleSetBudget}
                className="px-5 py-3 bg-green-500 text-white rounded-lg text-lg shadow-md hover:bg-green-600 transition"
              >
                ✅ Set Budget
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-3 bg-gray-400 text-white rounded-lg text-lg shadow-md hover:bg-gray-500 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SetBudget;
