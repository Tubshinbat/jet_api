const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const PositionSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  slug: String,

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

  picture: {
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

PositionSchema.pre("save", function (next) {
  if (this.mn.name) this.slug = slugify(this.mn.name);
  if (this.eng.name) this.slug = slugify(this.eng.name);
  next();
});

PositionSchema.pre("updateOne", function (next) {
  if (this.mn.name) this.slug = slugify(this.mn.name);
  if (this.eng.name) this.slug = slugify(this.eng.name);
  next();
});

module.exports = mongoose.model("Position", PositionSchema);
