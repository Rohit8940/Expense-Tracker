import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddExpense = () => {
    const [title,setTitle] = useState("")
    const [amount,setAmount] = useState("")
    const [category,setCategory] = useState("")
    const [refreshFlag,setRefreshFlag] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const timestamp = new Date().toISOString();
      const token = localStorage.getItem("token");

      if(!token){
        console.error("No token found! User may not be logged in")
        return
      }
      setRefreshFlag((prev) => !prev);
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
        navigate("/");
        window.location.reload(); // Force reload to fetch latest expenses
        fetchExpenses();
      } catch (error) {
        console.error("Error Adding Expense:", error);
      }
    };
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-6'>
      <div className='bg-white p-6 rounded-lg shadown-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-4'>Add Expense</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
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
    </div>

  )
}

export default AddExpense