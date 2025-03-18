import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f2f2f2] p-5">
      <h2 className="text-3xl font-bold mb-5">ℹ️ About This App</h2>

      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold">📖 What is This App?</h3>
        <p className="text-gray-600 mt-2">
          This Expense Tracker helps you manage your daily expenses, track spending trends, and stay within budget.
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg mt-4">
        <h3 className="text-xl font-semibold">🛠️ Built With</h3>
        <ul className="text-gray-600 list-disc pl-5 mt-2">
          <li>React (Frontend)</li>
          <li>Node.js + Express (Backend)</li>
          <li>MongoDB (Database)</li>
          <li>Tailwind CSS (Styling)</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg mt-4">
        <h3 className="text-xl font-semibold">👨‍💻 Developer</h3>
        <p className="text-gray-600 mt-2">Designed & Developed by **Rohit**</p>
        <p className="text-gray-500">🚀 Passionate about AI & Web Development</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg mt-4">
        <h3 className="text-xl font-semibold">🔮 Future Features</h3>
        <ul className="text-gray-600 list-disc pl-5 mt-2">
          <li>AI-Powered Expense Insights</li>
          <li>Auto-Categorization of Expenses</li>
          <li>Investment & Savings Tracker</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
