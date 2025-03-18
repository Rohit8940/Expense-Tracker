import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SetBudget from './SetBudget';
export const HomeRight = () => {
    const [expenses, setExpenses] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [months, setMonths] = useState([]);
  const [budget, setBudget] = useState(null); // Removed localStorage initialization
      const [title,setTitle] = useState("")
      const [amount,setAmount] = useState("")
          const [category,setCategory] = useState("")

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const token = localStorage.getItem("token");

    if(!token){
      console.error("No token found! User may not be logged in")
      return
    }
  
    try {
      await axios.post("http://localhost:5000/api/expenses", {
        title,
        amount: parseFloat(amount),
        category,
        timestamp
      },

      {
        headers:{Authorization: `Bearer ${token}`}
      }
  
  );
  
      // Redirect & Refresh Expenses
    //   navigate("/");
      window.location.reload(); // Force reload to fetch latest expenses
    } catch (error) {
      console.error("Error Adding Expense:", error);
    }
  };

  // ✅ Fetch Budget & Expenses on Mount
  useEffect(() => {
    console.log("📌 Home Component Mounted - Fetching Expenses & Budget");
    fetchExpenses();
    fetchBudget();
  }, []);

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
    
    <div className="w-[25%] flex-1 p-6 bg-white space-y-8">
          

        {/* Set Budget Component */}
        <div className='flex items-center'>
        <SetBudget onSave={(newBudget) => {
          setBudget(newBudget); // ✅ Update UI instantly
        }} />
         {/* Display Budget if Set */}
      {budget !== null && (
        <div className="text-center text-lg font-semibold text-green-700 mt-2">
          🎯 Monthly Budget: ${budget}
        </div>
      )}
        </div>
        
      <div className='bg-white p-6 rounded-lg shadown-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-4'>Add Expense</h2>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4 items-center'>
            <input
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            required
            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <input
            type='number'
            placeholder='Amount'
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            required
            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <select
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              required
              className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'>

              <option value = "">Select Category </option>
              <option value = "Food">Food</option>
              <option value = "Transport">Transport</option>
              <option value = "Entertainment">Entertainment</option>
              <option value = "Other">Other</option>
            </select>
            <button type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition'>
              Add Expense </button>
        </form>
        </div>
         <div className="flex justify-center space-x-4 mb-6">
      
      </div>

     

      {/* Warning if Budget Exceeded */}
      {budget !== null && totalSpent > budget && (
        <div className="text-center text-lg font-semibold text-red-600 mt-2">
          ⚠️ Warning: You have exceeded your budget!
        </div>
      )}
         
        </div>
  )
}

export default HomeRight;
