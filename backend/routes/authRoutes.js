import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();

router.post("/signup",async(req,res) =>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exists"})

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({name,email,password : hashedPassword})

        await newUser.save();
        res.status(201).json({message: "User Created Successfully"})
        
    }
    catch(error)
    {
        res.status(500).json({message: "Server Error"})
    }
})

router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid email or password"});

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({message:"Invalid email or password"});

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'2h'})
        // localStorage.setItem("token", token); // Ensure this is done

        res.json({token,user:{_id:user._id,name:user.name,email:user.email}});
    }
    catch(error){
        res.status(500).json({message:"Server Error"})
    }
})


export default router;