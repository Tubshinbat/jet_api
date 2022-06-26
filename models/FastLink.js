const mongoose = require("mongoose");

const FastLinkSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  mn: {
    name: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  eng: {
    name: {
      type: String,
    },
    about: {
      type: String,
    },
  },

  direct: {
    type: String,
  },

  icon: {
    type: String,
  },

  picture: {
    type: String,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },

  updateAt: {
    type: Date,
    default: Date.now,
  },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  updateUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("FastLink", FastLinkSchema);
