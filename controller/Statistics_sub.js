const Statistics_sub = require("../models/Statistics_sub");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createStatisticsSub = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const name = req.body.name;

  delete req.body.name;

  req.body[language] = {
    name,
  };

  const statisticsSub = await Statistics_sub.create(req.body);

  statisticsSub.createUser = req.userId;
  statisticsSub.save();

  res.status(200).json({
    success: true,
    data: statisticsSub,
  });
});

exports.getStatisticsSub = asyncHandler(async (req, res, next) => {
  const statistic = req.query.main;
  const limit = parseInt(req.query.limit) || null;

  const query = Statistics_sub.find();

  query.populate("statistic");
  query.where("statistic").equals(statistic);

  if (limit !== null) {
    query.limit(limit);
  }

  const statisticsSub = await query.exec();

  res.status(200).json({
    success: true,
    data: statisticsSub,
  });
});

exports.multDeleteStatisticsSub = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const result = await Statistics_sub.find({ _id: { $in: ids } });

  if (result.length <= 0) {
    throw new MyError("Таны сонгосон статистикууд байхгүй байна", 400);
  }

  const statistics = await Statistics_sub.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getSingleStatisticsSub = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics_sub.findById(req.params.id);

  if (!statistics) {
    throw new MyError("Тухайн статистик байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.deleteStatisticSub = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics_sub.findById(req.params.id);
  if (!statistics) {
    throw new MyError("мэдээлэл олдсонгүй", 404);
  }

  statistics.remove();

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.updateStatisticsSub = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const language = req.cookies.language || "mn";

  delete req.body.language;
  delete req.body.name;

  language === "eng" ? delete req.body.mn : delete req.body.eng;

  req.body[language] = {
    name,
  };

  let statistics = await Statistics_sub.findById(req.params.id);

  if (!statistics) {
    throw new MyError("Тухайн мэдээлэл олдсонгүй. ", 404);
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  console.log(req.body);

  statistics = await Statistics_sub.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

exports.getCountStatisticsSub = asyncHandler(async (req, res, next) => {
  const statistics = await Statistics_sub.count();
  res.status(200).json({
    success: true,
    data: statistics,
  });
});
