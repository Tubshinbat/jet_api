const mongoose = require("mongoose");

const StatisticsSub = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  statistic: {
    type: mongoose.Schema.ObjectId,
    ref: "Statistics",
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

  count: {
    type: Number,
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

module.exports = mongoose.model("StatisticsSub", StatisticsSub);
