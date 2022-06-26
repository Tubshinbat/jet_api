const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const BannerSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    required: [true, "Төлөв сонгоно уу"],
  },

  eng: {
    name: {
      type: String,
      minlength: 5,
      maxlength: 150,
    },

    details: {
      type: String,
      maxlength: 350,
    },
  },
  banner: {
    type: String,
  },

  video: {
    type: String,
  },
  mn: {
    name: {
      type: String,
    },

    details: {
      type: String,
    },
  },

  menu: {
    type: mongoose.Schema.ObjectId,
    ref: "Menu",
  },

  model: {
    type: String,
    enum: ["news", "null"],
  },

  link: {
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

BannerSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

BannerSchema.pre("updateOne", function (next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("Banner", BannerSchema);
