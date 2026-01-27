import User from "../models/User.model.js"
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import e from "express";

export async function signup(req,res){
    const {email,password,fullName}=req.body;

    try {
        //check all field
        if(!email || !password || !fullName){
            return res.status(400).json({message:"All field are required"});
        }

        //password length must be < 6
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 character"})
        }
        
        //email format regex
        const emailRegex = /^[^/s@]+@[^/s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(400).json({message:"Email already exists,please use a different one"});
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvator = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePic:randomAvator,
        });

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d",
        })

        res.cookie("jwt",token,{
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly: true,  // prevent XSS attacks
            sameSite:"strict",  // prevent CSRF attacks
            secure:process.env.NODE_ENV==="production"
        })

        res.status(201).json({success:true,user:newUser})

    } catch (error) {
        console.log("Error in signup controller",error);
        res.send(500).json({message:"Internal Server Error"});
    }
}
export async function login(req,res){
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All field are required"});
        }

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:"Invalid email or password"});  
        
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid email or password"})
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d",
        })

        res.cookie("jwt",token,{
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly: true,  // prevent XSS attacks
            sameSite:"strict",  // prevent CSRF attacks
            secure:process.env.NODE_ENV==="production"
        })

        res.status(200).json({success:true,user})
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}
export async function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Logout successful"});
}