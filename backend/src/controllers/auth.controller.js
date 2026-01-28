import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { upsertUserStream } from "../lib/stream.js";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    //check all field
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All field are required" });
    }

    //password length must be < 6
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character" });
    }

    //email format regex
    const emailRegex = /^[^/s@]+@[^/s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Email already exists,please use a different one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvator = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvator,
    });

    try {
      await upsertUserStream({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser._id}`);
    } catch (error) {
      console.error("Error stream user:", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}
export async function onboard(req,res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are require",
        missingFields:[
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location",
        ].filter(Boolean)
      });
    }
    const updateUser =await User.findByIdAndUpdate(userId,{
        ...req.body,
        isOnboarded:true,
    },{new:true})
    if(!updateUser) return res.status(404).json({message:"User not found"});


    res.status(200).json({success:true,user:updateUser})
  } catch (error) {
    console.error("Onboarding error:",error);
    return res.status(500).json({message:"Internal server error"});
  }
}
