import React from "react";

const SummaryCard = ({ totalIncome, totalExpense }) => {
  const balance = totalIncome - totalExpense;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full">
      <h2 className="text-xl font-semibold mb-2">💰 Financial Summary</h2>
      <div className="flex justify-between">
        <div className="text-green-600">
          <p className="text-sm">Income</p>
          <p className="text-lg font-bold">₹{totalIncome}</p>
        </div>
        <div className="text-red-600">
          <p className="text-sm">Expenses</p>
          <p className="text-lg font-bold">₹{totalExpense}</p>
        </div>
        <div className="text-gray-800">
          <p className="text-sm">Balance</p>
          <p className="text-lg font-bold">₹{balance}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
