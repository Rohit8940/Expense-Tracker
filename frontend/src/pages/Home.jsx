import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SetBudget from "../components/SetBudget";

const Home = ({refreshFlag}) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [months, setMonths] = useState([]);
  const [budget, setBudget] = useState(null); // Removed localStorage initialization

  // ✅ Fetch Budget from Backend
  const fetchBudget = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;
      if (!userId) {
        console.error("🚨 No user ID found");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("🚨 No token found");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/budget/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data) {
        console.warn("⚠️ No budget data returned from API");
        return;
      }

      console.log("✅ Budget Fetched from API:", response.data);
      setBudget(response.data.amount); // Update state from API response
    } catch (error) {
      console.error("❌ Error fetching budget:", error.response?.data || error.message);
    }
  };

  // ✅ Fetch Expenses from Backend
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔹 Stored Token:", token);

      if (!token) {
        console.error("🚨 No token found. User may not be logged in.");
        return;
      }

      console.log("📤 Sending request to fetch expenses...");
      const response = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Expenses API Response:", response.data);
      const expensesData = response.data;

      // Ensure dates are properly formatted
      const formattedExpenses = expensesData.map((exp) => ({
        ...exp,
        date: exp.date ? new Date(exp.date) : null,
      }));

      // Extract unique months + years
      const monthSet = new Set();
      formattedExpenses.forEach((exp) => {
        if (exp.date) {
          const monthYear = exp.date.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          });
          monthSet.add(monthYear);
        }
      });

      // Automatically select "This Month" as default
      const currentMonthYear = new Date().toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      setExpenses(formattedExpenses);
      setMonths(["This Month", ...Array.from(monthSet)]);
      setSelectedMonth(currentMonthYear);
    } catch (error) {
      console.error("❌ Error Fetching Expenses:", error.response?.data?.message || error.message);
    }
  };

  // ✅ Fetch Budget & Expenses on Mount
  useEffect(() => {
    console.log("📌 Home Component Mounted - Fetching Expenses & Budget");
    fetchExpenses();
    fetchBudget();
  }, [refreshFlag]);

  // ✅ Delete an Expense
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🗑️ Deleting Expense ID:", id);

      if (!token) {
        console.error("🚨 No token found. User may not be logged in.");
        return;
      }

      console.log(`📤 Sending DELETE request to /api/expenses/${id}`);
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Expense Deleted Successfully");
      fetchExpenses(); // Refresh list after deletion
    } catch (error) {
      console.error("❌ Error Deleting Expense:", error.response?.data?.message || error.message);
    }
  };

  // ✅ Filter Expenses by Selected Month
  const filteredExpenses = expenses.filter((exp) => {
    if (!exp.date) return false;

    const expenseMonthYear = exp.date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (selectedMonth === "This Month") {
      const currentMonthYear = new Date().toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      return expenseMonthYear === currentMonthYear;
    }

    return expenseMonthYear === selectedMonth;
  });

  // ✅ Calculate Total Spent
  const totalSpent = filteredExpenses.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="flex flex-col min-h-screen justify-evenly px-5 bg-[#f2f2f2]">

      <div className="flex flex-col items-start px-4">
        {/* Month Selector */}
        <div className="flex  justify-center items-center gap-2">
          <p className="text-3xl">Expenses By</p>
          <select
            className="p-2 border rounded-md bg-gray-100 text-3xl"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
         

          {/* Set Budget Component */}
          {/* <SetBudget onSave={(newBudget) => {
          setBudget(newBudget); // ✅ Update UI instantly
        }} /> */}
        </div>
        <div className="mt-6 text-center">
            <p className="text-2xl font-semibold">
              Total Spent: <span className="text-red-500">${totalSpent}</span>
            </p>
          </div>

        {/* Display Budget if Set */}
        {/* {budget !== null && (
        <div className="text-center text-lg font-semibold text-green-700 mt-2">
          🎯 Monthly Budget: ${budget}
        </div>
      )} */}

        {/* Warning if Budget Exceeded */}
        {/* {budget !== null && totalSpent > budget && (
        <div className="text-center text-lg font-semibold text-red-600 mt-2">
          ⚠️ Warning: You have exceeded your budget!
        </div>
      )} */}
      </div>

      {/* Expenses List */}
      

      
      <div className="bg-[#f2f2f2] px-5">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500">No expenses found.</p>
        ) : (
          <ul className="space-y-4">
  {filteredExpenses.map(({ _id, title, amount, category, date }) => (
    <li
      key={_id}
      className="flex justify-between items-center p-4 bg-white shadow-lg rounded-2xl border border-gray-200"
    >
      {/* Left Section (Title & Amount) */}
      <div>
        <p className="font-semibold text-lg">{title}</p>
        <p className="text-red-500 font-bold text-xl">${amount}</p>
      </div>

      {/* Right Section (Category, Date & Delete Button) */}
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="text-gray-400 text-xs">
            {date
              ? new Date(date).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Invalid Date"}
          </p>
          <p className="text-gray-500 text-sm font-medium">{category}</p>
        </div>
        
        {/* Delete Button */}
        <button
          onClick={() => deleteExpense(_id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition duration-300 shadow-md"
        >
          ❌
        </button>
      </div>
    </li>
  ))}
</ul>

        )}
      </div>
      

      {/* Total Expenses */}

    </div>
  );
};

export default Home;
