const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    enum: ["guest", "host"],
    default: "guest",
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
