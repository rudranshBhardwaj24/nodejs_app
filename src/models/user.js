const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      smallcase: true,
    },
    password: {
      required: true,
      type: String,
    },
    age: {
      type: Number,
      max: 99,
    },
    gender: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Rudra");
  return token;
};

module.exports = mongoose.model("User", userSchema);
