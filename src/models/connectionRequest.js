const mongoose = require("mongoose");
const user = require("./user");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["requested", "interested", "accept", "reject"],
        message: "{VALUE} is not allowed",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.toUserId.equals(this.fromUserId)) {
    throw new Error("Can not send request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
