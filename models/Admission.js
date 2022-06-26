const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
  types: {
    type: mongoose.Schema.ObjectId,
    ref: "Profession",
  },

  urgiinOvog: {
    type: String,
    required: [true, "Ургийн овгоо оруулна уу."],
  },

  picture: {
    type: String,
    required: [true, "Цээж зураг оруулна уу"],
  },

  fristName: {
    type: String,
    required: [true, "Нэрээ оруулна уу"],
  },
  lastName: {
    type: String,
    required: [true, "Овог нэрээ оруулна уу"],
  },
  register: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Регистерийн дугаараа оруулна уу"],
  },

  birth: {
    type: Date,
    required: [true, "Төрсөн он сар өдрийн оруулна уу"],
  },
  gender: {
    type: String,
    required: [true, "Хүйсээ сонгоно уу"],
  },
  country: {
    type: String,
    required: [true, "Улсаа сонгоно уу"],
  },
  province: {
    type: String,
    required: [true, "Аймагаа сонгоно уу"],
  },
  diploma: {
    type: String,
  },
  graduatedDate: {
    type: String,
    required: [true, "Төгссөн огноо оруулна уу"],
  },

  phone: {
    type: String,
    required: [true, "Утасаа оруулна уу"],
  },
  otherPhone: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Имэйл Хаягаа оруулна уу"],
  },
  address: {
    type: String,
    required: [true, "Хаягаа оруулна уу"],
  },

  files: [Object],

  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },

  updateUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Admission", AdmissionSchema);
