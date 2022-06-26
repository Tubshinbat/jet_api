const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Та өөрийн нэрийг заавал оруулах шаардлагатай."],
  },

  email: {
    type: String,
    required: [true, "Хэрэглэгчинй имэйл хаягийг оруулж өгнө үү"],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Имэйл хаягаа буруу оруулсан байна",
    ],
  },
  phoneNumber: {
    type: Number,
  },
  message: {
    type: String,
    required: [true, "Санал хүсэлтээ бичнэ үү"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
