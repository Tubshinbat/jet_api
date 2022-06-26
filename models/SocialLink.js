const mongoose = require("mongoose");

const SocialLinksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Сошиал сувгийн нэр"],
  },
  link: {
    type: String,
    required: [true, "Сошиал сувгийн холбоос"],
  },

  createAt: {
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
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SocialLink", SocialLinksSchema);
