const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const PageSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  listAdmissionActive: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  listActive: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  admissionActive: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  admissionLink: {
    type: String,
  },

  eng: {
    name: {
      type: String,
    },

    pageInfo: {
      type: String,
    },
  },

  mn: {
    name: {
      type: String,
    },

    pageInfo: {
      type: String,
    },
  },

  menu: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Menu",
    },
  ],

  position: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Position",
    },
  ],

  footerMenu: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "FooterMenu",
    },
  ],

  pictures: {
    type: [String],
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

module.exports = mongoose.model("Page", PageSchema);
