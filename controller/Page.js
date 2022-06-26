const SitePage = require("../models/Page");
const Menu = require("../models/Menu");
const MyError = require("../utils/myError");
// const asyncHandler = require("express-async-handler");
const asyncHandler = require("../middleware/asyncHandler");
const paginate = require("../utils/paginate");
const { decode } = require("html-entities");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createPage = asyncHandler(async (req, res) => {
  const files = req.files;
  let fileNames;

  const language = req.cookies.language || "mn";
  const { name, pageInfo } = req.body;
  ["name", "pageInfo"].map((el) => delete req.body[el]);

  req.body[language] = {
    name,
    pageInfo,
  };

  let page = await SitePage.create(req.body);

  if (files) {
    if (files.pictures.length >= 2) {
      fileNames = await multImages(files, "page");
    } else {
      fileNames = await fileUpload(files.pictures, "page");
      fileNames = [fileNames.fileName];
    }
    page.pictures = fileNames;
    if (req.body.menu) {
      const menus = await Menu.updateMany(
        { _id: { $in: req.body.menu } },
        { $set: { picture: fileNames[0] } }
      );
    }
  }

  page.createUser = req.userId;
  page.save();

  res.status(200).json({
    success: true,
    data: page,
  });
});

exports.getPages = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };

  let status = req.query.status || "null";
  const name = req.query.name || "";
  const menu = req.query.menu;
  const admissionActive = req.query.admissionActive || null;
  let nameSearch = {};

  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  [
    "select",
    "sort",
    "page",
    "limit",
    "status",
    "menu",
    "name",
    "admissionActive",
  ].forEach((el) => delete req.query[el]);

  const query = SitePage.find();
  query.find({
    $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }],
  });

  query.populate("menu");

  query.sort(sort);
  if (status != "null") {
    query.where("status").equals(status);
  }
  if (
    admissionActive !== null &&
    admissionActive !== "null" &&
    admissionActive !== undefined &&
    admissionActive !== "undefined"
  ) {
    query.where("admissionActive").equals(admissionActive);
  }
  if (menu != "null" && menu != undefined && menu != "undefined") {
    query.where("menu").in(menu);
  }

  const sitePage2 = await query.exec();

  const pagination = await paginate(page, limit, SitePage, sitePage2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const sitePage = await query.exec();

  res.status(200).json({
    success: true,
    count: sitePage.length,
    data: sitePage,
    pagination,
  });
});

exports.multDeletePages = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findPages = await SitePage.find({ _id: { $in: ids } });
  if (findPages.length <= 0) {
    throw new MyError("Таны сонгосон аяллууд байхгүй байна", 404);
  }
  const sitePages = await SitePage.deleteMany({ _id: { $in: ids } });
  res.status(200).json({
    success: true,
    data: sitePages,
  });
});

exports.getMenuData = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const page = await SitePage.findOne({})
    .where("menu")
    .in(id)
    .populate("position");
  if (!page) {
    throw new MyError("Хайсан мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    success: true,
    data: page,
  });
});

exports.getPage = asyncHandler(async (req, res, next) => {
  const sitePage = await SitePage.findById(req.params.id)
    .populate("menu")
    .populate("footerMenu")
    .populate("position");
  if (!sitePage) {
    throw new MyError("Тухайн хуудас байхгүй байна.", 404);
  }
  res.status(200).json({
    success: true,
    data: sitePage,
  });
});

exports.getFooterData = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const page = await SitePage.findOne({}).where("footerMenu").in(id);
  if (!page) {
    throw new MyError("Хайсан мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    success: true,
    data: page,
  });
});

exports.getSlug = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findOne({ slug: req.params.slug });

  if (!menu) {
    throw new MyError("Тухайн хуудас байхгүй байна.", 404);
  }

  const sitePage = await SitePage.findOne({ menu: menu._id });

  if (!sitePage) {
    throw new MyError("Тухайн хуудас байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: sitePage,
  });
});

exports.updatePage = asyncHandler(async (req, res, next) => {
  let sitePage = await SitePage.findById(req.params.id);
  let fileNames = [];
  let oldFiles = req.body.oldPicture || null;

  if (
    req.body.position === "" ||
    req.body.position === undefined ||
    req.body.position === "undefined" ||
    req.body.position === null
  )
    delete req.body.position;

  if (!sitePage) {
    throw new MyError("Тухайн хуудас байхгүй байна...", 404);
  }

  const language = req.cookies.language || "mn";
  const { name, pageInfo } = req.body;
  language === "eng" ? delete req.body.mn : delete req.body.eng;
  ["name", "pageInfo"].map((el) => delete req.body[el]);

  req.body[language] = {
    name,
    pageInfo,
  };

  const files = req.files;

  if (files) {
    if (files.pictures.length >= 2) {
      fileNames = await multImages(files, "news");
    } else if (files.pictures) {
      fileNames = await fileUpload(files.pictures, "news");
      fileNames = [fileNames.fileName];
    }
  }

  if (
    oldFiles !== undefined &&
    oldFiles !== null &&
    typeof oldFiles !== "string"
  )
    req.body.pictures = [...oldFiles, ...fileNames];
  else if (typeof oldFiles === "string") req.body.pictures = [oldFiles];
  else req.body.pictures = [...fileNames];

  if (typeof req.body.menu === "string") {
    req.body.menu = [req.body.menu];
  }

  if (req.body.menu && req.body.pictures) {
    const menus = await Menu.updateMany(
      { _id: { $in: req.body.menu } },
      { $set: { picture: req.body.pictures[0] } }
    );
  }

  req.body.updateUser = req.userId;

  sitePage = await SitePage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: sitePage,
  });
});

exports.getCountPages = asyncHandler(async (req, res, next) => {
  const sitePage = await SitePage.count();
  res.status(200).json({
    success: true,
    data: sitePage,
  });
});
