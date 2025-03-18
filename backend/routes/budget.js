import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Budget from "../models/budgetModel.js";

const router = express.Router();

// ✅ Get User Budget
router.get("/:userId", authMiddleware, async (req, res) => {
    try {
        const budget = await Budget.findOne({ user: req.params.userId }); // ✅ Fix: Use `user`
        if (!budget) return res.json({ amount: 0 });

        res.json({ amount: budget.amount });
    } catch (error) {
        console.error("❌ Error fetching budget:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// ✅ Set or Update Budget (Now Uses `/:userId`)
router.post("/:userId", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        const { userId } = req.params; // ✅ Extract userId from params

        let budget = await Budget.findOne({ user: userId });

        if (budget) {
            budget.amount = amount;
        } else {
            budget = new Budget({ user: userId, amount });
        }

        await budget.save();
        res.json({ message: "Budget updated", amount: budget.amount });
    } catch (error) {
        console.error("❌ Error updating budget:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
