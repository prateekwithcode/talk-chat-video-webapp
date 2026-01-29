import express from "express";
import { logout,signup,login } from "../controllers/auth.controller.js";
import {ProtectRoute} from "../middleware/auth.middleware.js";
import { onboard } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.post("/onboarding",ProtectRoute ,onboard);

router.get("/me",ProtectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
})

export default router;