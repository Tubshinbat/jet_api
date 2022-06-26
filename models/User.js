const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    required: [true, "Төлөв сонгоно уу"],
    default: false,
  },

  name: {
    type: String,
    required: [true, "Хэрэглэгчинй нэрийг оруулна уу"],
    minlength: [1, "Нэр 1 үсэгнээс бүтэхгүй болно."],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Хэрэглэгчинй имэйл хаягийг оруулж өгнө үү"],
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Имэйл хаягаа буруу оруулсан байна",
    ],
  },

  avatar: {
    type: String,
  },

  phoneCode: {
    type: String,
  },

  phone: {
    type: Number,
    required: [true, "Утасны дугаар заавал оруулна уу"],
    unique: true,
  },

  sex: {
    type: String,
    enum: ["male", "female", "other"],
  },

  role: {
    type: String,
    required: [true, "Хэрэглэгчийн эрхийг сонгоно уу"],
    enum: ["user", "operator", "admin"],
    default: "user",
  },

  password: {
    type: String,
    minlength: [8, "Нууц үг 8 - аас дээш тэмэгдээс бүтэх ёстой."],
    required: [true, "Нууц үгээ оруулна уу"],
    select: false,
  },

  address: {
    type: String,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  updateUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createAt: {
    type: Date,
    default: Date.now,
  },

  updateAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role, name: this.name, avatar: this.avatar },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generatePasswordChangeToken = function () {
  // const resetToken = crypto.randomBytes(20).toString("hex");
  // this.resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");

  const resetToken = 100000 + Math.floor(Math.random() * 900000);
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
