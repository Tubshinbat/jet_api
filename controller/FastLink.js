const FastLink = require("../models/FastLink");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createFastLink = asyncHandler(async (req, res, next) => {
  const files = req.files;
  const language = req.cookies.language || "mn";
  const { name, about } = req.body;

  ["name", "about"].map((el) => delete req.body[el]);

  req.body[language] = {
    name,
    about,
  };

  let fileNames;

  if (!files) {
    throw new MyError(" зураг оруулна уу", 400);
  }

  const picture = await fileUpload(files.picture, "fastlink").catch((error) => {
    throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
  });

  req.body.picture = picture.fileName;

  const fastLink = await FastLink.create(req.body);

  res.status(200).json({
    success: true,
    data: fastLink,
  });
});

exports.getFastLinks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  let status = req.query.status || "null";
  const name = req.query.name;
  let nameSearch = {};
  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  ["sort", "page", "limit", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = FastLink.find();
  query.find({ $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }] });
  query.sort(sort);
  if (status != "null") {
    query.where("status").equals(status);
  }

  const fastLink2 = await query.exec();

  const pagination = await paginate(page, limit, FastLink, fastLink2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const fastLink = await query.exec();

  res.status(200).json({
    success: true,
    count: fastLink.length,
    data: fastLink,
    pagination,
  });
});

exports.multDeleteFastLink = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findFastLink = await FastLink.find({ _id: { $in: ids } });

  if (findFastLink.length <= 0) {
    throw new MyError("Таны сонгосон цэснүүд олдсонгүй", 404);
  }

  findFastLink.map(async (el) => {
    await imageDelete(el.picture);
  });

  const fastLink = await FastLink.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getFastLink = asyncHandler(async (req, res, next) => {
  const fastLink = await FastLink.findById(req.params.id);

  if (!fastLink) {
    throw new MyError("Тухайн линк байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: fastLink,
  });
});

exports.updateFastLink = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const { name, about } = req.body;

  language === "eng" ? delete req.body.mn : delete req.body.eng;
  ["name", "about"].map((el) => delete req.body[el]);

  req.body[language] = {
    name,
    about,
  };

  let fastLink = await FastLink.findById(req.params.id);
  let newPicture = req.body.oldPicture;
  delete req.body.picture;

  if (!fastLink) {
    throw new MyError("Тухайн цэс байхгүй байна. ", 404);
  }

  const files = req.files;
  if (!newPicture && !files) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  if (files) {
    const resImg = await fileUpload(files.picture, "fastlink");
    newPicture = resImg.fileName;
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;
  if (newPicture !== null) req.body.picture = newPicture;

  fastLink = await FastLink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: fastLink,
  });
});
