const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModule } = require("../model/connectionRequest");
const { User } = require("../model/user");
const userRouts = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about skills";

userRouts.get("/user/received/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModule.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "All the connection request received",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

userRouts.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModule.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouts.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModule.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()),
        hideUsersFromFeed.add(req.toUserId.toString());
    });
    console.log(connectionRequest);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    console.log(users);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

module.exports = { userRouts };
