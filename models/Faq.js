const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const FaqSchema = new mongoose.Schema({
  mn: {
    question: {
      type: String,
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
    },
  },

  eng: {
    question: {
      type: String,
      trim: true,
    },

    answer: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("Faq", FaqSchema);
