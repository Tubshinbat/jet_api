const TopLink = require("../models/TopLink");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createTopLink = asyncHandler(async (req, res, next) => {
  const files = req.files;
  const language = req.cookies.language || "mn";
  const { name, about } = req.body;

  ["name", "about"].map((el) => delete req.body[el]);

  req.body[language] = {
    name,
    about,
  };

  let fileNames;

  if (!files || !files.picture || !files.icon) {
    throw new MyError(" зураг оруулна уу", 400);
  }

  const picture = await fileUpload(files.picture, "toplink").catch((error) => {
    throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
  });

  const icon = await fileUpload(files.icon, "toplink").catch((error) => {
    throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
  });

  req.body.picture = picture.fileName;
  req.body.icon = icon.fileName;

  const topLink = await TopLink.create(req.body);

  res.status(200).json({
    success: true,
    data: topLink,
  });
});

exports.getTopLinks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  let status = req.query.status || "null";
  const name = req.query.name;
  const direct = req.query.direct || null;
  let nameSearch = {};
  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  ["sort", "page", "limit", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = TopLink.find();
  query.find({ $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }] });
  if (direct !== null) {
    query.find({ direct: { $ne: "" } });
  }
  query.sort(sort);
  if (status != "null") {
    query.where("status").equals(status);
  }

  const topLink2 = await query.exec();

  const pagination = await paginate(page, limit, TopLink, topLink2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const topLink = await query.exec();

  res.status(200).json({
    success: true,
    count: topLink.length,
    data: topLink,
    pagination,
  });
});

exports.getSlugTopLink = asyncHandler(async (req, res, next) => {
  const slugData = req.params.slug;

  const topLink = await TopLink.findOne({ direct: slugData });

  if (!topLink) {
    throw new MyError("Таны сонгосон цэснүүд олдсонгүй", 404);
  }

  res.status(200).json({
    success: true,
    data: topLink,
  });
});

exports.multDeleteTopLink = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findTopLinks = await TopLink.find({ _id: { $in: ids } });

  if (findTopLinks.length <= 0) {
    throw new MyError("Таны сонгосон цэснүүд олдсонгүй", 404);
  }

  findTopLinks.map(async (el) => {
    await imageDelete(el.picture);
    await imageDelete(el.icon);
  });

  const topLink = await TopLink.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getTopLink = asyncHandler(async (req, res, next) => {
  const topLink = await TopLink.findById(req.params.id);

  if (!topLink) {
    throw new MyError("Тухайн линк байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: topLink,
  });
});

exports.updateTopLink = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const { name, about } = req.body;

  language === "eng" ? delete req.body.mn : delete req.body.eng;
  ["name", "about"].map((el) => delete req.body[el]);

  let topLink = await TopLink.findById(req.params.id);
  let newPicture = req.body.oldPicture;
  let newIcon = req.body.oldIcon;

  delete req.body.picture;
  delete req.body.icon;

  req.body[language] = {
    name,
    about,
  };

  if (!topLink) {
    throw new MyError("Тухайн ном байхгүй байна. ", 404);
  }

  const files = req.files;
  if (!newPicture && !newIcon && !files) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  if (files) {
    if (files.picture) {
      const resImg = await fileUpload(files.picture, "toplink");
      newPicture = resImg.fileName;
    }
    if (files.icon) {
      const resIcon = await fileUpload(files.icon, "toplink");
      newIcon = resIcon.fileName;
    }
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;
  if (newPicture !== null) req.body.picture = newPicture;
  if (newIcon !== null) req.body.icon = newIcon;

  topLink = await TopLink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: topLink,
  });
});
