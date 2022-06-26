const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const AboutSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    required: [true, "Төлөв сонгоно уу"],
  },

  mn: {
    about: {
      type: String,
      required: [true, "Заавал утга оруулах хэрэгтэй."],
      minlength: [150, "Та 150 -аас дээш тэмдэгт оруулна уу"],
    },

    shortAbout: {
      type: String,
      required: [true, "Заавал богино тайлбар оруулна уу"],
      minlength: [90, "90 - аас дээш тэмдэгт оруулна уу"],
      maxlength: [500, "500 - аас дээш тэмдэгт оруулах боломжгүй."],
    },
  },

  eng: {
    about: {
      type: String,
      required: true,
      minlength: 150,
    },

    shortAbout: {
      type: String,
      required: true,
      minlength: 90,
      maxlength: 500,
    },
  },

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

module.exports = mongoose.model("About", AboutSchema);
