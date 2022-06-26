const Faq = require("../models/Faq");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

exports.createFaq = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;
  const language = req.cookies.language;
  const { question, answer } = req.body;

  ["question", "answer"].map((el) => delete req.body[el]);

  req.body[language] = {
    question,
    answer,
  };

  const faq = await Faq.create(req.body);

  res.status(200).json({
    success: true,
    data: faq,
  });
});

exports.updateFaq = asyncHandler(async (req, res) => {
  const language = req.cookies.language || "mn";
  const { question, answer } = req.body;
  ["question", "answer"].map((el) => delete req.body[el]);

  req.body[language] = {
    question,
    answer,
  };

  let faq = await Faq.findById(req.params.id);
  if (!faq) throw new MyError("Тухайн асуулт хариулт олдсонгүй", 404);

  req.body.updateAt = new Date();
  req.body.updateUser = req.userId;

  faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: faq,
  });
});

exports.deleteFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) {
    throw new MyError("Түгээмэл асуулт алга байна. ", 404);
  }

  res.status(200).json({
    success: true,
    data: faq,
  });
});

exports.getFaq = asyncHandler(async (req, res, next) => {
  const faqs = await Faq.find({}).sort({ createAt: -1 });
  if (!faqs) {
    throw new MyError("Илэрц олдсонгүй", 404);
  }
  res.status(200).json({
    success: true,
    data: faqs,
  });
});
