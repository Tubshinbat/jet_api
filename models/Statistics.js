const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const Statistics = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  eng: {
    type: {
      name: {
        type: String,
      },
    },
  },

  mn: {
    type: {
      name: {
        type: String,
      },
    },
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

module.exports = mongoose.model("Statistics", Statistics);
