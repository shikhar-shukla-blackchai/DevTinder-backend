const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending the connection request");
  res.send(user.firstName + "send the connection request");
});

module.exports = { requestRouter };
