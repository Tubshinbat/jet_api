const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const FooterMenuSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },

  isDirect: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  isModel: {
    type: Boolean,
    enum: [true, false],
    default: false,
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

  direct: {
    type: String,
  },

  slug: {
    type: String,
  },

  parentId: {
    type: String,
  },

  model: {
    type: String,
    enum: ["news", "employee", "contact", "medias"],
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

FooterMenuSchema.pre("save", function (next) {
  if (this.mn.name) this.slug = slugify(this.mn.name);
  if (this.eng.name) this.slug = slugify(this.eng.name);
  next();
});

FooterMenuSchema.pre("updateOne", function (next) {
  if (this.mn.name !== null) this.slug = slugify(this.mn.name);
  if (this.eng.name !== null) this.slug = slugify(this.eng.name);
  next();
});

module.exports = mongoose.model("FooterMenu", FooterMenuSchema);
