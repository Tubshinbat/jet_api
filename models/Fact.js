const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const FactSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Fact", FactSchema);
