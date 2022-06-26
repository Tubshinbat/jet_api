const Book = require("../models/Book");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createBook = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let fileNames;

  if (!files) {
    throw new MyError("Номны зураг оруулна уу", 400);
  }

  const picture = await fileUpload(files.picture, "book").catch((error) => {
    throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
  });

  req.body.picture = picture.fileName;

  console.log(req.body);

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.getBooks = asyncHandler(async (req, res, next) => {
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

  const query = Book.find();
  query.find({ name: nameSearch });
  query.sort(sort);
  if (status != "null") {
    query.where("status").equals(status);
  }

  const book2 = await query.exec();

  const pagination = await paginate(page, limit, Book, book2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const book = await query.exec();

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
    pagination,
  });
});

exports.multDeleteBook = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findBooks = await Book.find({ _id: { $in: ids } });

  if (findBooks.length <= 0) {
    throw new MyError("Таны сонгосон номнууд байхгүй байна", 400);
  }

  findBooks.map(async (el) => {
    await imageDelete(el.picture);
  });

  const book = await Book.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError("Тухайн ном байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  let newFile = null;
  let oldFile = req.body.oldPicture;
  delete req.body.picture;

  if (!book) {
    throw new MyError("Тухайн ном байхгүй байна. ", 404);
  }

  const files = req.files;
  if (!oldFile && !files) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  if (files) {
    const fileNames = await fileUpload(files.picture, "book");
    newFile = fileNames.fileName;
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;
  if (newFile !== null) req.body.picture = newFile;

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: book,
  });
});
