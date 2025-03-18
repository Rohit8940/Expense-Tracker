import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true} //linked to the user
},{timestamps:true});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
