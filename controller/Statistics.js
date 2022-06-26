const Statistics = require("../models/Statistics");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
// const fs = require("fs");
const paginate = require("../utils/paginate");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createStatistics = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const name = req.body.name;

  delete req.body.name;

  req.body[language] = {
    name,
  };

  const statistics = await Statistics.create(req.body);

  statistics.createUser = req.userId;
  statistics.save();

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.getStatistics = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics.find();

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.multDeleteStatistics = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const result = await Statistics.find({ _id: { $in: ids } });

  if (result.length <= 0) {
    throw new MyError("Таны сонгосон статистикууд байхгүй байна", 400);
  }

  const statistics = await Statistics.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getSingleStatistics = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics.findById(req.params.id);

  if (!statistics) {
    throw new MyError("Тухайн статистик байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.getActive = asyncHandler(async (req, res) => {
  const statistic = await Statistics.findOne({ status: true }).limit(1);

  res.status(200).json({
    success: true,
    data: statistic,
  });
});

exports.deleteStatistic = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics.findById(req.params.id);
  if (!statistics) {
    throw new MyError("мэдээлэл олдсонгүй", 404);
  }

  statistics.remove();

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.updateStatistics = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const language = req.cookies.language || "mn";

  delete req.body.language;
  delete req.body.name;

  language === "eng" ? delete req.body.mn : delete req.body.eng;

  if (name) {
    req.body[language] = {
      name,
    };
  }

  let statistics = await Statistics.findById(req.params.id);

  if (!statistics) {
    throw new MyError("Тухайн мэдээлэл олдсонгүй. ", 404);
  }

  if (req.body.status) {
    await Statistics.updateMany({}, { status: false });
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  statistics = await Statistics.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.getCountStatistics = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics.count();
  res.status(200).json({
    success: true,
    data: statistics,
  });
});
