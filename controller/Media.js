const Media = require("../models/Media");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
// const fs = require("fs");
const paginate = require("../utils/paginate");
const {
  multImages,
  fileUpload,
  imageDelete,
  multFile,
} = require("../lib/photoUpload");
const moment = require("moment-timezone");
const dateUlaanbaatar = moment.tz(Date.now(), "Asia/Ulaanbaatar");
const { valueRequired } = require("../lib/check");

exports.createMedia = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let fileNames, videoNames, audioNames;
  const language = req.cookies.language || "mn";
  const name = req.body.name;
  const details = req.body.details;
  const shortDetails = req.body.shortDetails;
  ["language", "shrotDetails", "name", "details"].map(
    (data) => delete req.body[data]
  );
  req.body[language] = {
    name,
    details,
    shortDetails,
  };
  if (!files) {
    throw new MyError("Медиа зураг оруулна уу", 400);
  }

  if (!files.pictures) {
    throw new MyError("Медиа зураг оруулна уу", 400);
  }

  const media = await Media.create(req.body);
  if (files.pictures.length >= 2) {
    fileNames = await multImages(files, Date.now());
  } else {
    fileNames = await fileUpload(files.pictures, Date.now());
    fileNames = [fileNames.fileName];
  }

  if (files.videos) {
    if (files.videos.length >= 2) {
      videoNames = await multFile(files.videos, Date.now());
    } else {
      videoNames = await fileUpload(files.videos, Date.now(), false);
      videoNames = [videoNames.fileName];
    }
  }

  if (files.audios) {
    if (files.audios.length >= 2) {
      audioNames = await multFile(files.audios, "media");
    } else {
      audioNames = await fileUpload(files.audios, "media", false);
      audioNames = [audioNames.fileName];
    }
  }

  if (req.body.type === "audio" && audioNames) {
    media.audios = audioNames;
  }

  if (req.body.type === "video" && videoNames) {
    media.videos = videoNames;
  }

  media.createUser = req.userId;
  media.pictures = fileNames;
  media.save();

  res.status(200).json({
    success: true,
    data: media,
  });
});

exports.getMedia = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  const select = req.query.select;
  let category = req.query.category || null;
  let status = req.query.status || null;
  let star = req.query.star || null;
  const name = req.query.name;
  const sortMedia = req.query.sortMedia;
  let nameSearch = {};
  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*", $options: "i" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*", $options: "i" };
  }
  [
    "select",
    "sort",
    "page",
    "limit",
    "category",
    "status",
    "name",
    "star",
    "sortMedia",
  ].forEach((el) => delete req.query[el]);

  if (valueRequired(sortMedia)) {
    if (sortMedia === "views") sort = { views: -1 };
    if (sortMedia === "star") star = "true";
    if (sortMedia === "last") sort = { createAt: -1 };
  }

  const query = Media.find();
  query.find({ $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }] });
  query.populate("categories");
  query.select(select);
  query.sort(sort);

  if (valueRequired(category)) query.where("categories").in(category);
  if (valueRequired(status)) query.where("status").equals(status);
  if (valueRequired(star)) query.where("star").equals(star);

  const media2 = await query.exec();

  const pagination = await paginate(page, limit, Media, media2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const media = await query.exec();

  res.status(200).json({
    success: true,
    count: media.length,
    data: media,
    pagination,
  });
});

exports.multDeleteMedia = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findMedia = await Media.find({ _id: { $in: ids } });

  if (findMedia.length <= 0) {
    throw new MyError("Таны сонгосон мэдээнүүд байхгүй байна", 400);
  }

  findMedia.map(async (el) => {
    await imageDelete(el.pictures);
  });

  const media = await Media.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getSingleMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id).populate("categories");

  if (!media) {
    throw new MyError("Тухайн мэдээ байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: media,
  });
});

exports.updateMedia = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const name = req.body.name;
  const details = req.body.details;
  const shortDetails = req.body.shortDetails;

  ["shortDetails", "name", "details"].map((el) => delete req.body[el]);
  language === "eng" ? delete req.body.mn : delete req.body.eng;

  req.body[language] = {
    name,
    details,
    shortDetails,
  };

  let media = await Media.findById(req.params.id);
  let fileNames = [];
  let videoNames, audioNames;
  let oldFiles = req.body.oldPicture;
  let oldVideos = req.body.oldVideos;
  let oldAudios = req.body.oldAudios;

  req.body.videos = req.body.oldVideos;
  req.body.audios = req.body.oldAudios;

  if (!media) {
    throw new MyError("Тухайн мэдээ байхгүй байна. ", 404);
  }

  const files = req.files;
  if (!req.body.oldPicture && !files) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  if (!req.body.oldPicture) {
    if (!files.pictures) {
      throw new MyError("Та зураг upload хийнэ үү", 400);
    }
  }

  if (files) {
    if (files.pictures) {
      if (files.pictures.length >= 2) {
        fileNames = await multImages(files, "media");
      } else {
        fileNames = await fileUpload(files.pictures, "media");
        fileNames = [fileNames.fileName];
      }
    }
    if (files.videos) {
      if (files.videos.length >= 2) {
        videoNames = await multFile(files.videos, "media");
      } else {
        videoNames = await fileUpload(files.videos, "media", false);
        videoNames = [videoNames.fileName];
      }
    }

    if (files.audios) {
      if (files.audios.length >= 2) {
        audioNames = await multFile(files.audios, "media");
      } else {
        audioNames = await fileUpload(files.audios, "media", false);
        audioNames = [audioNames.fileName];
      }
    }
  }

  typeof oldFiles != "string"
    ? (req.body.pictures = [...oldFiles, ...fileNames])
    : (req.body.pictures = [oldFiles, ...fileNames]);

  if (oldVideos && typeof oldVideos != "string" && videoNames) {
    req.body.vidoes = [...oldVideos, ...videoNames];
  }

  if (oldVideos && typeof oldVideos === "string") {
    if (videoNames) {
      req.body.videos = [oldVideos, ...videoNames];
    } else {
      req.body.videos = [oldVideos];
    }
  } else if (videoNames) {
    req.body.videos = [...videoNames];
  }

  if (oldAudios && typeof oldAudios != "string" && audioNames) {
    req.body.audios = [...oldAudios, ...audioNames];
  }

  if (oldAudios && typeof oldAudios === "string") {
    if (audioNames) {
      req.body.audios = [oldAudios, ...audioNames];
    } else {
      req.body.audios = [oldAudios];
    }
  } else if (audioNames) {
    req.body.audios = [...audioNames];
  }

  if (typeof req.body.categories === "string") {
    req.body.categories = [req.body.categories];
  }

  req.body.updateUser = req.userId;

  media = await Media.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: media,
  });
});

exports.getCountMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.count();
  res.status(200).json({
    success: true,
    data: media,
  });
});

exports.getAllMedia = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  const select = req.query.select;
  let category = req.query.category;
  let status = req.query.status || "";
  const name = req.query.name;
  let nameSearch = {};

  if (typeof sort === "string") {
    sort = JSON.parse("{" + req.query.sort + "}");
  }

  if (category === "*") {
    category = null;
  }
  if (
    status === "*" ||
    status === "" ||
    status === undefined ||
    status === null ||
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

  ["select", "sort", "page", "limit", "category", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = Media.find({ $text: { $search: nameSearch } });

  query.populate("categories");
  query.populate("createUser");
  query.select(select);
  query.sort(sort);

  if (category) {
    query.where("categories").in(category);
  }
  if (status) {
    query.where("status").equals(status);
  }

  const media2 = await query.exec();

  const query2 = Media.find({ $text: { $search: nameSearch } });

  query2.populate("categories");
  query2.populate("createUser");
  query2.select(select);
  query2.sort(sort);

  if (category) {
    query2.where("categories").in(category);
  }
  if (status) {
    query2.where("status").equals(status);
  }

  const pagination = await paginate(page, limit, null, media2.length);
  query2.skip(pagination.start - 1);
  query2.limit(limit);

  const media = await query2.exec();

  res.status(200).json({
    success: true,
    count: media.length,
    data: media,
    pagination,
  });
});

exports.getTags = asyncHandler(async (req, res, next) => {
  let agg = [{ $group: { _id: { tags: "$tags" } } }];
  const tags = await Media.aggregate(agg);
  res.status(200).json({
    success: true,
    data: tags,
  });
});

exports.getSlugMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findOne({ slug: req.params.slug })
    .populate("categories")
    .populate("createUser");

  if (!media) {
    throw new MyError("Тухайн мэдээ байхгүй байна. ", 404);
  }

  const newViews = media.views + 1;
  await Media.findByIdAndUpdate(media._id, { views: newViews });

  res.status(200).json({
    success: true,
    data: media,
  });
});

exports.updateView = asyncHandler(async (req, res, next) => {
  const media = await Media.findOne({ slug: req.params.slug });

  if (!media) {
    throw new MyError("Тухайн мэдээ байхгүй байна. ", 404);
  }

  const newViews = media.views + 1;
  await Media.findByIdAndUpdate(media._id, { views: newViews });

  res.status(200).json({
    success: true,
    data: media,
  });
});
