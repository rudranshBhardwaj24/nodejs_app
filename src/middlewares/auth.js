const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedObj = await jwt.verify(token, "Rudra");
    const { _id } = decodedObj;

    const user = User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = await user;
    next();
  } catch {
    res.status("404").send("User not found");
  }
};

module.exports = {
  userAuth,
};
