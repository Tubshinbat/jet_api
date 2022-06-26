const Position = require("../models/Position");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
// const fs = require("fs");
const paginate = require("../utils/paginate");
const { fileUpload } = require("../lib/photoUpload");

exports.createPosition = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const name = req.body.name;
  const about = req.body.about;

  delete req.body.language;
  delete req.body.about;
  delete req.body.name;

  req.body[language] = {
    name,
    about,
  };

  const position = await Position.create(req.body);

  position.createUser = req.userId;
  position.save();

  res.status(200).json({
    success: true,
    data: position,
  });
});

exports.getPositions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };

  const name = req.query.name;
  let nameSearch = {};

  const positions = await Position.find().sort(sort);

  if (!positions) {
    throw new MyError("Олдсонгүй ээ", 404);
  }

  res.status(200).json({
    success: true,
    data: positions,
  });
});

exports.deletePosition = asyncHandler(async (req, res) => {
  const position = await Position.findById(req.params.id);
  if (!position) {
    throw new MyError(req.params.id + " хэлтэс байхгүй байна", 404);
  }

  position.remove();

  res.status(200).json({
    success: true,
    data: position,
  });
});

exports.multDeletePosition = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findPositions = await Position.find({ _id: { $in: ids } });

  if (findPositions.length <= 0) {
    throw new MyError("Таны сонгосон тэнхимууд байхгүй байна", 400);
  }

  const position = await Position.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getPosition = asyncHandler(async (req, res, next) => {
  const position = await Position.findById(req.params.id);

  if (!position) {
    throw new MyError("Тухайн нэгж байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: position,
  });
});

exports.updatePosition = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const name = req.body.name;
  const about = req.body.about;

  delete req.body.language;
  delete req.body.about;
  delete req.body.name;

  language === "eng" ? delete req.body.mn : delete req.body.eng;

  req.body[language] = {
    name,
    about,
  };

  let position = await Position.findById(req.params.id);

  if (!position) {
    throw new MyError("Тухайн хэлтэс байхгүй байна. ", 404);
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  if (typeof req.body.position === "string") {
    req.body.position = [req.body.position];
  }

  position = await Position.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: position,
  });
});

exports.getCountPosition = asyncHandler(async (req, res, next) => {
  const position = await Position.count();
  res.status(200).json({
    success: true,
    data: position,
  });
});

exports.getSlugPosition = asyncHandler(async (req, res, next) => {
  const position = await Position.findOne({ slug: req.params.slug }).populate(
    "createUser"
  );

  if (!position) {
    throw new MyError("Тухайн хэлтэс байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: position,
  });
});
