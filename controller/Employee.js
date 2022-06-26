const Employees = require("../models/Employees");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
// const fs = require("fs");
const paginate = require("../utils/paginate");
const { multImages, fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createEmployee = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let fileName;
  const language = req.cookies.language || "mn";
  const { name, about, degree } = req.body;

  delete req.body.about;
  delete req.body.name;
  delete req.body.degree;
  delete req.body.language;
  delete req.body.picture;

  req.body[language] = {
    name,
    about,
    degree,
  };

  const employee = await Employees.create(req.body);
  if (files !== null) {
    if (files.picture.length >= 2) {
      fileName = await multImages(files, Date.now());
    } else {
      fileName = await fileUpload(files.picture, Date.now());
      fileName = [fileName.fileName];
    }
  }
  employee.picture = fileName;
  employee.createUser = req.userId;

  employee.save();

  res.status(200).json({
    success: true,
    data: employee,
  });
});

exports.getEmployees = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  let position = req.query.position;
  let status = req.query.status || null;
  const name = req.query.name || null;
  const positionsIds = req.query.positionId || null;
  let nameSearch = {};

  if (position == "null") {
    position = null;
  }

  if (typeof sort === "string") {
    sort = JSON.parse("{" + req.query.sort + "}");
  }

  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*", $options: "i" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*", $options: "i" };
  }

  ["select", "sort", "page", "limit", "position", "status", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = Employees.find();
  query.find({ $or: [{ "eng.name": nameSearch }, { "mn.name": nameSearch }] });
  query.populate("positions");
  if (positionsIds) {
    query.find({ positions: { $in: positionsIds } });
  }
  // query.select(select);
  query.sort(sort);
  if (position != "null" && position != undefined && position != "undefined") {
    query.where("positions").in(position);
  }
  if (status !== null && status !== "null") {
    query.where("status").equals(status);
  }

  const employee2 = await query.exec();

  const pagination = await paginate(page, limit, Employees, employee2.length);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const employee = await query.exec();

  res.status(200).json({
    success: true,
    count: employee.length,
    data: employee,
    pagination,
  });
});

exports.multDeleteEmployees = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findEmployees = await Employees.find({ _id: { $in: ids } });

  if (findEmployees.length <= 0) {
    throw new MyError("Таны сонгосон хүмүүс байхгүй байна", 400);
  }

  findEmployees.map(async (el) => {
    await imageDelete(el.avatar);
  });

  const employee = await Employees.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employees.findById(req.params.id).populate(
    "positions"
  );

  if (!employee) {
    throw new MyError("Тухайн ажилтан байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

exports.updateEmployee = asyncHandler(async (req, res, next) => {
  const language = req.cookies.language || "mn";
  const name = req.body.name;
  const about = req.body.about || "";
  const degree = req.body.degree;

  ["name", "about", "degree"].map((el) => delete req.body[el]);

  delete req.body.language;

  language === "eng" ? delete req.body.mn : delete req.body.eng;

  req.body[language] = {
    name,
    degree,
    about,
  };

  let employee = await Employees.findById(req.params.id);
  let fileNames = [];
  let oldFiles = req.body.oldPicture || null;

  console.log(req.body);

  if (!employee) {
    throw new MyError("Тухайн ажилтан байхгүй байна. ", 404);
  }

  const files = req.files;
  console.log(files);
  if (files) {
    if (files.picture.length >= 2) {
      fileNames = await multImages(files, "employee");
    } else {
      fileNames = await fileUpload(files.picture, "employee");
      fileNames = [fileNames.fileName];
    }
  }
  if (oldFiles !== null) {
    if (typeof oldFiles != "string") {
      req.body.picture = [...oldFiles, ...fileNames];
    } else {
      req.body.picture = [oldFiles, ...fileNames];
    }
  } else if (fileNames) {
    req.body.picture = fileNames;
  }
  if (typeof req.body.position === "string") {
    req.body.position = [req.body.position];
  }

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  employee = await Employees.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: employee,
  });
});

exports.getCountEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employees.count();
  res.status(200).json({
    success: true,
    data: employee,
  });
});

exports.getSlugEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employees.findOne({ slug: req.params.slug })
    .populate("position")
    .populate("createUser");

  if (!employee) {
    throw new MyError("Тухайн ажилтан байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});
