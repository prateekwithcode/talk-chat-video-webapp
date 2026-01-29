import express from "express";
import ProtectRoute from "../middleware/auth.middleware.js";
import { getRecommendedUsers,getMyFriends} from "../controllers/user.controller.js";
const router = express.Router();

// apply authentication middleware to all routes

router.use(ProtectRoute);

router.get("/",ProtectRoute,getRecommendedUsers);
router.get("/friends",ProtectRoute,getMyFriends);


export default router;