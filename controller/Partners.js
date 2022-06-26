const Partner = require("../models/Partner");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
// const fs = require("fs");
const paginate = require("../utils/paginate");
const { fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createPartner = asyncHandler(async (req, res, next) => {
  const files = req.files;
  req.body.status = req.body.status || false;
  let fileName;

  if (!files) {
    throw new MyError("Хамтрагч компаний лого оруулна уу", 400);
  }

  const partner = await Partner.create(req.body);

  if (files) {
    fileName = await fileUpload(files.logo, "partner").catch((error) => {
      throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
    });
    fileName = fileName.fileName;
  }

  partner.createUser = req.userId;
  partner.logo = fileName;
  partner.save();

  res.status(200).json({
    success: true,
    data: partner,
  });
});

exports.getPartners = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  const select = req.query.select;
  let status = req.query.status || "null";
  const name = req.query.name;
  let nameSearch = {};

  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  ["select", "sort", "page", "limit", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = Partner.find();
  query.find({ name: nameSearch });
  query.select(select);
  query.sort(sort);
  if (status !== "null") {
    query.where("status").equals(status);
  }

  const partner2 = await query.exec();

  const pagination = await paginate(page, limit, Partner, partner2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const partner = await query.exec();

  res.status(200).json({
    success: true,
    count: partner.length,
    data: partner,
    pagination,
  });
});

exports.multDeletePartner = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findPartner = await Partner.find({ _id: { $in: ids } });

  if (findPartner.length <= 0) {
    throw new MyError("Таны сонгосон хамтрагчид байхгүй байна", 400);
  }

  findPartner.map(async (el) => {
    await imageDelete(el.pictures);
  });

  const partner = await Partner.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getPartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id).populate("categories");

  if (!partner) {
    throw new MyError("Тухайн компани байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: partner,
  });
});

exports.updatePartner = asyncHandler(async (req, res, next) => {
  let partner = await Partner.findById(req.params.id);
  let fileNames = req.body.oldLogo;

  if (!partner) {
    throw new MyError("Тухайн компани байхгүй байна. ", 404);
  }

  const files = req.files;
  if (!req.body.oldLogo && !files) {
    throw new MyError("Та лого upload хийнэ үү", 400);
  }

  if (files) {
    fileNames = await fileUpload(files.logo, "logo");
    fileNames = fileNames.fileName;
  }

  req.body.logo = fileNames;
  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;
  delete req.body.oldLogo;

  product = await Partner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    // data: product,
  });
});

exports.getCountProduct = asyncHandler(async (req, res, next) => {
  const partner = await Partner.count();
  res.status(200).json({
    success: true,
    data: partner,
  });
});
