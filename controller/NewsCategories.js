const NewsCategory = require("../models/NewsCategory");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.createNewsCategory = asyncHandler(async (req, res, next) => {
  const language = req.body.language;
  const name = req.body.name;
  delete req.body.language;
  delete req.body.name;

  req.body[req.cookies.language] = {
    name,
  };

  const category = await NewsCategory.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category = null;
  if (parentId === null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    let mn, eng;

    if (cate.mn !== undefined) mn = { name: cate.mn.name };
    if (cate.eng !== undefined) eng = { name: cate.eng.name };

    categoryList.push({
      _id: cate._id,
      slug: cate.slug,
      children: createCategories(categories, cate._id),
      mn,
      eng,
    });
  }

  return categoryList;
}

exports.getNewsCategories = asyncHandler(async (req, res, next) => {
  NewsCategory.find({}).exec((error, categories) => {
    if (error)
      return res.status(400).json({
        success: false,
        error,
      });
    if (categories) {
      const categoryList = createCategories(categories);

      res.status(200).json({
        success: true,
        data: categoryList,
      });
    }
  });
});

exports.getNewsCategory = asyncHandler(async (req, res, next) => {
  const newsCategory = await NewsCategory.findById(req.params.id);

  if (!newsCategory) {
    throw new MyError(
      req.params.id + " Тус мэдээний ангилал байхгүй байна.",
      404
    );
  }

  res.status(200).json({
    success: true,
    data: newsCategory,
  });
});

exports.deletetNewsCategory = asyncHandler(async (req, res, next) => {
  const category = await NewsCategory.findById(req.params.id);
  if (!category) {
    throw new MyError(req.params.id + " ангилал байхгүй байна", 404);
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateNewsCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  delete req.body.name;

  req.body[req.cookies.language] = {
    name,
  };

  const category = await NewsCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    throw new MyError("Ангилалын нэр солигдсонгүй", 400);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});
