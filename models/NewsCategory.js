const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const NewsCategorySchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },

  mn: {
    name: {
      type: String,
    },
  },

  eng: {
    name: {
      type: String,
    },
  },

  slug: {
    type: String,
  },
  parentId: {
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

NewsCategorySchema.pre("save", function (next) {
  if (this.mn.name) this.slug = slugify(this.mn.name);
  if (this.eng.name) this.slug = slugify(this.eng.name);
  next();
});

NewsCategorySchema.pre("updateOne", function (next) {
  if (this.mn.name) this.slug = slugify(this.mn.name);
  if (this.eng.name) this.slug = slugify(this.eng.name);
  next();
});

module.exports = mongoose.model("NewsCategory", NewsCategorySchema);
