const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    required: [true, "Төлөв сонгоно уу"],
    default: false,
  },

  name: {
    type: String,
    required: [true, "Хуудасны гарчиг оруулна уу"],
  },

  link: {
    type: String,
  },

  logo: {
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

module.exports = mongoose.model("Partner", PartnerSchema);
