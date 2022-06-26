const mongoose = require("mongoose");

const WebInfoSchema = new mongoose.Schema({
  mn: {
    type: {
      logo: {
        type: String,
      },
      whiteLogo: {
        type: String,
      },
      name: {
        type: String,
      },

      address: {
        type: String,
      },
      siteInfo: {
        type: String,
      },
      policy: {
        type: String,
      },
    },
  },

  phone: {
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
    type: {
      logo: {
        type: String,
      },
      whiteLogo: {
        type: String,
      },
      name: {
        type: String,
      },

      address: {
        type: String,
      },
      siteInfo: {
        type: String,
      },
      policy: {
        type: String,
      },
    },
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

module.exports = mongoose.model("WebInfo", WebInfoSchema);
