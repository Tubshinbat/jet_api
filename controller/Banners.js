const Banner = require("../models/Banner");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

const paginate = require("../utils/paginate");
const sharp = require("sharp");
const { fileUpload, videoUpload, imageDelete } = require("../lib/photoUpload");

exports.createBanner = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const { name, details } = req.body;
  ["name", "details"].map((el) => delete req.body[el]);

  req.body[language] = {
    name,
    details,
  };

  const files = req.files;
  let Fbanner, Fvideo;
  req.body.status = req.body.status || false;

  if (files.banner && files.video) {
    throw new MyError("Видео болон зургийн аль нэгийг нь оруулна уу");
  }

  if (files.banner) {
    Fbanner = await fileUpload(files.banner, "banner").catch((error) => {
      throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
    });
    req.body.banner = Fbanner.fileName;
  }

  if (files.video) {
    Fvideo = await videoUpload(files.video, "video").catch((error) => {
      throw new MyError(`Видео хуулах үед алдаа гарлаа: ${error}`, 400);
    });
    req.body.video = Fvideo.fileName;
  }

  const banner = await Banner.create(req.body);

  res.status(200).json({
    success: true,
    data: banner,
  });
});

exports.getBanners = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };

  let status = req.query.status || null;
  const name = req.query.name;
  let nameSearch = {};

  if (typeof sort === "string") {
    sort = JSON.parse("{" + req.query.sort + "}");
  }

  if (
    status === "*" ||
    status === "" ||
    status === undefined ||
    status === null ||
    status === "null" ||
    status === "undefined"
  ) {
    status = null;
  } else {
    if (status === true) status = true;
    if (status === false) status = false;
  }

  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  ["select", "sort", "page", "limit", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = Banner.find();
  query.find({ $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }] });
  query.populate("createUser");
  query.sort(sort);

  if (status) {
    query.where("status").equals(status);
  }

  const banner2 = await query.exec();

  const query2 = Banner.find();

  query2.find({ $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }] });
  query2.populate("createUser");
  query2.sort(sort);

  if (status) {
    query2.where("status").equals(status);
  }

  const pagination = await paginate(page, limit, null, banner2.length);
  query2.skip(pagination.start - 1);
  query2.limit(limit);

  const banner = await query2.exec();

  res.status(200).json({
    success: true,
    count: banner.length,
    data: banner,
    pagination,
  });
});

exports.getBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!Banner) {
    throw new MyError("Тухайн баннер байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: banner,
  });
});

exports.multDeleteBanner = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findBanners = await Banner.find({ _id: { $in: ids } });

  if (findBanners.length <= 0) {
    throw new MyError("Таны сонгосон баннерууд байхгүй байна", 400);
  }

  findBanners.map(async (el) => {
    await imageDelete(el.banner);
    await imageDelete(el.video);
  });

  const banner = await Banner.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id).populate("createUser");

  if (!banner) {
    throw new MyError("Тухайн баннер байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: banner,
  });
});

exports.updateBanner = asyncHandler(async (req, res, next) => {
  let banner = await Banner.findById(req.params.id);
  let Fbanner, Fvideo;
  let oldBanner = req.body.oldBanner;
  let oldVideo = req.body.oldVideo;
  Fvideo = oldVideo;
  Fbanner = oldBanner;

  const language = req.cookies.language || "mn";
  const { name, details } = req.body;
  ["name", "details"].map((el) => delete req.body[el]);

  language === "eng" ? delete req.body.mn : delete req.body.eng;

  req.body[language] = {
    name,
    details,
  };

  if (!banner) {
    throw new MyError("Тухайн баннер байхгүй байна. ", 404);
  }

  const files = req.files;

  if (!oldBanner && !oldVideo && !files) {
    throw new MyError("Та баннер upload хийнэ үү", 400);
  }

  if (files) {
    if (files.banner) {
      const result = await fileUpload(files.banner, "banner").catch((error) => {
        throw new MyError(`Баннер хуулах явцад алдаа гарлаа: ${error} `, 400);
      });
      Fbanner = result.fileName;
      if (req.body.banner) {
        await imageDelete(oldBanner);
      }
    }
    if (files.video) {
      const videoResult = await videoUpload(files.video, "video").catch(
        (error) => {
          throw new MyError(`Бичлэг хуулах явцад алдаа гарлаа: ${error}`, 400);
        }
      );
      Fvideo = videoResult.fileName;
    }
  }

  req.body.banner = Fbanner;
  req.body.video = Fvideo;
  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: banner,
  });
});

exports.getCounBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.count();
  res.status(200).json({
    success: true,
    data: banner,
  });
});
