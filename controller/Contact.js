const Contact = require("../models/Contact");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const paginate = require("../utils/paginate");

exports.createContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(200).json({
    success: true,
    data: contact,
  });
});

exports.getContacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let sort = req.query.sort || { createAt: -1 };
  const select = req.query.select;
  const name = req.query.name;
  let nameSearch = {};

  if (typeof sort === "string") {
    sort = JSON.parse("{" + req.query.sort + "}");
  }

  if (name === "" || name === null || name === undefined) {
    nameSearch = { $regex: ".*" + ".*" };
  } else {
    nameSearch = { $regex: ".*" + name + ".*" };
  }

  ["select", "sort", "page", "limit", "name"].forEach(
    (el) => delete req.query[el]
  );

  const query = Contact.find();
  query.find({ name: nameSearch });
  query.select(select);
  query.sort(sort);

  const contactPage = await query.exec();

  const pagination = await paginate(page, limit, Contact, contactPage.length);
  query.limit(limit);
  query.skip(pagination.start - 1);

  const contact = await query.exec();

  res.status(200).json({
    success: true,
    count: contact.length,
    data: contact,
    pagination,
  });
});

exports.multDeleteContact = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findContacts = await Contact.find({ _id: { $in: ids } });

  if (findContacts.length <= 0) {
    throw new MyError("Таны сонгосон мэдээнүүд байхгүй байна", 400);
  }

  const contact = await Contact.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
    data: contact,
  });
});

exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new MyError("Тухайн мэдээ байхгүй байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});
