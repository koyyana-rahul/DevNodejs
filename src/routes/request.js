const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

const User = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    // const status = req.params.status;
    // const toUserId = req.params.toUserId;

    const { status, toUserId } = req.params;

    if (!["interested", "ignored"].includes(status)) {
      return res.json({ message: "Invalid status type" + status });
    }

    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({
        message: "cannot send request to yourself",
      });
    }

    const toUser = await User.findById({ _id: toUserId });
    if (!toUser) {
      res.json({ message: "User not found" });
    }

    const existingConnectionRequest = await connectionRequestModel.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnectionRequest) {
      res.json({ message: "connection request already existed" });
    }

    const connectionRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message:
        req.user.firstName + " was " + status + " in " + toUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

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
          .json({ message: "Invalid status type " + status });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request " + status, data });
    } catch (err) {}
  }
);

module.exports = requestRouter;
