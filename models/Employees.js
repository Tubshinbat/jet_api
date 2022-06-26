const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const EmployeesSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  positions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Position",
    },
  ],

  phoneNumber: {
    type: Number,
  },

  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Имэйл хаягаа буруу оруулсан байна",
    ],
  },

  eng: {
    about: {
      type: String,
    },

    name: {
      type: String,
    },

    degree: {
      type: String,
    },
  },

  mn: {
    about: {
      type: String,
    },

    name: {
      type: String,
    },

    degree: {
      type: String,
    },
  },
  slug: String,

  picture: {
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

EmployeesSchema.pre("save", function (next) {
  if (this.mn.name) this.slug = slugify(this.mn.name);
  if (this.eng.name) this.slug = slugify(this.eng.name);
  next();
});

EmployeesSchema.pre("updateOne", function (next) {
  if (this.mn.name !== null) this.slug = slugify(this.mn.name);
  if (this.eng.name !== null) this.slug = slugify(this.eng.name);
  next();
});

module.exports = mongoose.model("Employees", EmployeesSchema);
