import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

const Reports = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error("❌ Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // 📊 Process data for charts
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryTotals);
  const categoryValues = Object.values(categoryTotals);

  // 📊 Pie Chart Data
  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  // 📊 Bar Chart Data
  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Total Spending",
        data: categoryValues,
        backgroundColor: "#36a2eb",
      },
    ],
  };

  // 📊 Line Chart Data (Expenses Over Time)
  const dailyExpenses = {};
  expenses.forEach((exp) => {
    const date = new Date(exp.date).toLocaleDateString("en-GB");
    dailyExpenses[date] = (dailyExpenses[date] || 0) + exp.amount;
  });

  const lineData = {
    labels: Object.keys(dailyExpenses),
    datasets: [
      {
        label: "Daily Expenses",
        data: Object.values(dailyExpenses),
        borderColor: "#ff6384",
        fill: false,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center p-5 bg-[#f2f2f2] h-screen overflow-hidden">
      <h2 className="text-3xl font-bold mb-5">📊 Expense Reports</h2>

      {/* Scrollable Report Section */}
      <div className="w-full max-w-4xl h-[70vh] overflow-y-auto p-4 bg-[#f2f2f2] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart - Expense Breakdown */}
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Expense Breakdown</h3>
            <Pie data={pieData} />
          </div>

          {/* Bar Chart - Category-Wise Spending */}
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
            <Bar data={barData} />
          </div>

          {/* Line Chart - Monthly Trend */}
          <div className="bg-white p-4 shadow-lg rounded-lg col-span-2">
            <h3 className="text-lg font-semibold mb-2">Spending Over Time</h3>
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
