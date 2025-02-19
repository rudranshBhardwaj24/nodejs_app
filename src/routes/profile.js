const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const { validateProfileEdit } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const { hash } = require("bcrypt");

//View user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const userProfile = await req.user;
  console.log(userProfile);
  console.log(req.user);
  if (!userProfile) {
    res.send("Please log in to get profile");
  } else {
    res.send(userProfile);
  }
});

//Update user profile
profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  if (!validateProfileEdit(req)) {
    res.send("Invalid data");
  }
  const loggedInUser = await req.user;
  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
  console.log(loggedInUser);
  loggedInUser.save();
  res.send("updated successfully!");
});

//Update user password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const loggedInUser = await req.user;
  const { password } = await req.body;
  const hashedPassword = await hash(password, 10);
  loggedInUser.password = hashedPassword;
  await loggedInUser.save();
  res.send("password updated successfully");
});

module.exports = profileRouter;
