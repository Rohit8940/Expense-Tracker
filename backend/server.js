import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js"; // Importing the DB connection function
import expenseRoutes from './routes/expenseRoutes.js'
import authRoutes from './routes/authRoutes.js'
import budget from './routes/budget.js'


// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use('/api/expenses',expenseRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/budget',budget);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
