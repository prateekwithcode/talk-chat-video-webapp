import User from "../models/User.model.js";
import FriendRequest from "../models/FriendReq.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json({ recommendedUsers });
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage",
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending request to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "you can't send friend request to yourself" });
    }

    const recipient = await User.finById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not Found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "you are already friends with this user" });
    }

    // check if a req already exist
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(200).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not Found" });
    }

    //verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    //$addToset : adds elements to an array only if they do not already exist
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToset: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToset: { friends: friendRequest.recipient },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage",
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequest controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendRequest(req, res) {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage",
    );

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequest controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
