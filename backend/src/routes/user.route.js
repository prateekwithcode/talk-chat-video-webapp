import express from "express";
import ProtectRoute from "../middleware/auth.middleware.js";
import { getRecommendedUsers,getMyFriends} from "../controllers/user.controller.js";
const router = express.Router();

// apply authentication middleware to all routes

router.use(ProtectRoute);

router.get("/",ProtectRoute,getRecommendedUsers);
router.get("/friends",ProtectRoute,getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.post("/friend-requests",getFriendRequest);
router.post("/outgoing-friend-requests",getOutgoingFriendRequest);

export default router;