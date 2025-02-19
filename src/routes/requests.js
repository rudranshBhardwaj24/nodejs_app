const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const requestsRouter = express.Router();

//
requestsRouter.post(
  "/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    const fromUserId = await req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    console.log(fromUserId._id.toString());
    console.log(toUserId);

    try {
      if (mongoose.isValidObjectId(toUserId)) {
        checkUser = await user.findById(toUserId);
        if (!checkUser) {
          return res.status(404).send("User not found");
        }
      } else {
        return res.send("Invalid Object ID");
      }

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("invalid status type: " + status);
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.send("Request already exist");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      console.log(connectionRequest);
      await connectionRequest.save();
      res.send("Success");
    } catch (err) {
      res.send(err.message);
    }
  }
);

//
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const status = req.params.status;
    const toUser = await req.user;
    const requestId = req.params.requestId;

    const allowedStatus = ["accept", "reject"];

    if (!allowedStatus.includes(status)) {
      return res.send("Status not allowed");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: toUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status("404").json({ message: "No connection request found" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.send("Connection request " + status + "ed");
  }
);

module.exports = requestsRouter;
