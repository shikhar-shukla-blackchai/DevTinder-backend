const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModule } = require("../model/connectionRequest");
const { User } = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserid",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserid;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConnectionRequest = await ConnectionRequestModule.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Request already request");
      }

      const connectionRequest = new ConnectionRequestModule({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      if (data) {
        res.json({
          message: `${req.user.firstName}${
            status === "interested" ? " is" : ""
          } ${status} ${status === "interested" ? "in" : "the"} ${
            toUser.firstName
          }`,
          data: connectionRequest,
        });
      }
    } catch (err) {
      res.status(404).json({ message: "ERROR : " + err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status not allowed " + status });
      }

      const connectionRequest = await ConnectionRequestModule.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.send({
        message: loggedInUser.firstName + " " + status,
      });
    } catch (err) {
      res.status(400).send({ message: "ERROR :" + err.message });
    }
  }
);

module.exports = { requestRouter };
