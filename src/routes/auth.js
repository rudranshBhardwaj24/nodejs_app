const express = require("express");
const authRouter = express.Router();
const user = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateSingUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSingUpData(req);

    //hash value
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log(
      "unhashed password: " +
        password +
        "\n" +
        "hashed password: " +
        hashedPassword
    );
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).json({ message: "Unable to add user!", err: err.message });
  }
});

//login user
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  console.log(user);
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (isPasswordCorrect) {
    const token = await user.getJWT();
    console.log(user._id);

    if (user) {
      res.cookie("token", token);
      res.send("Login successful!");
    }
  } else {
    res.send("Invalid Password");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully!");
});

module.exports = authRouter;
