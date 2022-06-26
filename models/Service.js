const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const ServiceSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    required: [true, "Төлөв сонгоно уу"],
    default: false,
  },

  slug: String,

  name: {
    type: String,
    required: [true, "Үйлчилгээний гарчгийг оруулна уу"],
    unique: true,
    trim: true,
    minlength: [10, "Үйлчилгээний гарчиг 10-аас тэмдэгт дээш байх ёстой"],
    maxlength: [
      300,
      "Үйлчилгээний гарчгийн урт дээд тал нь 300 тэмдэгт байх ёстой.",
    ],
  },

  pictures: {
    type: [String],
    defualt: "no-photo.jpg",
  },

  details: {
    type: String,
    required: [true, "Үйлчилгээний дэлгэрэнгүй тайлбарыг оруулна уу."],
    trim: true,
    minlength: [
      20,
      "Үйлчилгээний дэлгэрэнгүй урт нь 20 - аас дээш тэмдэгт байх ёстой.",
    ],
  },

  shortDetails: {
    type: String,
  },

  language: {
    type: String,
    enum: ["mn", "eng"],
    default: "mn",
  },

  tags: {
    type: [String],
  },

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

ServiceSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

ServiceSchema.pre("updateOne", function (next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("Service", ServiceSchema);
