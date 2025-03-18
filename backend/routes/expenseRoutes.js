import express from 'express';
import Expense from '../models/expenseModel.js'
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Get Route

router.get('/',authMiddleware,async(req,res)=>{
    try{
        console.log("✅ Incoming request to fetch expenses");
        
        console.log("🔹 Authenticated User:", req.user);
        const userId = req.user._id;
        console.log("🔹 Converted userId:", userId);
        const expenses = await Expense.find({user:userId}).sort({createdAt: -1});
        
        res.json(expenses);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})

// 500 is internal server error


//Post 

router.post('/',authMiddleware,async (req,res)=>{
    const {title,amount,category,date} = req.body;

        const newExpense = new Expense({
            title,
            amount,
            category,
            date,
            user:req.user.id
        })
    try{
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
        }
        catch(error){
           res.status(400).json({message:error.message});    
        }
    
})

// 201 is for created
// 400 (bad request)

//Put method for updating

router.put('/:id',authMiddleware,async(req,res)=>{
    try{
        const expense = await Expense.findById(req.params.id);
        if(!expense) return res.status(404).json({message:"Expense not found"})

        if(expense.user.toString() !== req.user.id){
            return res.status(403).json({message:"Not Authorised"});
        }

        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(updatedExpense);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})
// finds the id from req.params.id and then gets the body from req.body and new:true ensures the
// updated document is returned

router.delete('/:id',authMiddleware,async(req,res)=>{
    try{
        const expense = await Expense.findById(req.params.id);
        if(!expense) return res.status(404).json({message:"Expense not found"});

        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
          }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({message:'Expense Deleted Successfully'})
    }
    catch(error){
        res.status(500).json({message:error.message});
    }

})



export default router;