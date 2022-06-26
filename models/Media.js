const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const MediaSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  slug: String,
  mn: {
    name: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
    },
    shortDetails: {
      type: String,
    },
  },

  eng: {
    name: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
    },
    shortDetails: {
      type: String,
    },
  },

  type: {
    type: String,
    enum: ["audio", "video"],
    default: "video",
  },

  pictures: {
    type: [String],
  },

  videos: {
    type: [String],
  },

  audios: {
    type: [String],
  },

  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "MediaCategory",
    },
  ],

  views: {
    type: Number,
    default: 0,
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

MediaSchema.pre("save", function (next) {
  const date = Date.now();
  if (this.mn.name) this.slug = slugify(this.mn.name) + date;
  if (this.eng.name) this.slug = slugify(this.eng.name) + date;
  next();
});

module.exports = mongoose.model("Media", MediaSchema);
