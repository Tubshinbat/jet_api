const Fact = require("../models/Fact");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.createFact = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const { name, about } = req.body;

  delete req.body.about;
  delete req.body.name;
  delete req.body.language;

  req.body[language] = {
    name,
    about,
  };

  const fact = await Fact.create(req.body);
  fact.createUser = req.userId;
  fact.save();

  res.status(200).json({
    success: true,
    data: fact,
  });
});

exports.getFacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  let status = req.query.status || null;
  const name = req.query.name || null;
  let nameSearch = {};

  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  ["select", "sort", "page", "limit", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = Fact.find({
    $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }],
  });
  query.sort(sort);
  if (status !== null && status !== "null") {
    query.where("status").equals(status);
  }
  const fact2 = await query.exec();

  const pagination = await paginate(page, limit, Fact, fact2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const fact = await query.exec();

  res.status(200).json({
    success: true,
    count: fact.length,
    data: fact,
    pagination,
  });
});

exports.multDeleteFacts = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findFacts = await Fact.find({ _id: { $in: ids } });

  if (findFacts.length <= 0) {
    throw new MyError("Таны сонгосон факт байхгүй байна", 400);
  }

  const fact = await Fact.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getFact = asyncHandler(async (req, res, next) => {
  const fact = await Fact.findById(req.params.id);

  if (!fact) {
    throw new MyError("Тухайн факт байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: fact,
  });
});

exports.updateFact = asyncHandler(async (req, res, next) => {
  const language = req.body.language || "mn";
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

  let fact = await Fact.findById(req.params.id);

  if (!fact) {
    throw new MyError("Тухайн ажилтан байхгүй байна. ", 404);
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  fact = await Fact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: fact,
  });
});

exports.getCountFact = asyncHandler(async (req, res, next) => {
  const fact = await Fact.count();
  res.status(200).json({
    success: true,
    data: fact,
  });
});
