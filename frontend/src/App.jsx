import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import "./App.css"
import axios from "axios";
import Sidebar from "./components/Sidebar"
import { useState } from "react";
import Login from "./pages/Login";
import LoginButton from "./components/LoginButton";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import SideCop from "./components/SideCop";
import HomeRight from "./components/HomeRight";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import About from "./pages/About";

const Layout = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null);

   // Fetch expenses from backend
   const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("🚨 No token found in localStorage! User may not be logged in.");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/expenses",{
        headers:{Authorization: `Bearer ${token}`}
      });
      const expensesData = response.data;

      // Group expenses by Month & Year
      const groupedExpenses = expensesData.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthYear = date.toLocaleString("en-US", { month: "short", year: "numeric" });

        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(expense);

        return acc;
      }, {});

      // Convert object to sorted array (latest first)
      const sortedMonths = Object.keys(groupedExpenses).sort(
        (a, b) => new Date(b) - new Date(a)
      );

      setExpenses({ grouped: groupedExpenses, sortedMonths });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="h-full w-full">
      {/* Top Navbar */}
      <div className="w-full flex justify-between gap-x-100 items-center px-20 py-4 bg-gray-800 text-white">
        {/* <Sidebar /> */}
        <div className="relative text-2xl font-bold">🚀 Expense Tracker</div>
        <LoginButton />
      </div>

      {/* Main Layout */}
      <div className=" h-screen w-screen flex bg-white">
        {/* Sidebar */}

        <SideCop/>





        {/* Main Content */}
        <div className="w-[60%]">{children}</div>

       {/* Expense List by Month & Year */}
       <HomeRight/>
       
      </div>
    </div>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <Routes>
      {/* Fullscreen Login Page (No Navbar or Sidebar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />

      {/* All other pages inside Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/Home" element={<Layout><Home /></Layout>} />
      <Route path="/add-expense" element={<Layout><AddExpense /></Layout>} />
      <Route path="/analysis" element={<Layout><div>📊 Analysis Page</div></Layout>} />
      <Route path="/Reports" element={<Layout><Reports/></Layout>} />
      <Route path="/Settings" element={<Layout><Settings/></Layout>} />
      <Route path="/About" element={<Layout><About/></Layout>} />
    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;