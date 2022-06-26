const MediaCategory = require("../models/MediaCategory");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.createMediaCategory = asyncHandler(async (req, res, next) => {
  const language = req.body.language;
  const name = req.body.name;
  delete req.body.language;
  delete req.body.name;

  req.body[req.cookies.language] = {
    name,
  };

  const category = await MediaCategory.create(req.body);

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

exports.getMediaCategories = asyncHandler(async (req, res, next) => {
  MediaCategory.find({}).exec((error, categories) => {
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

exports.getMediaCategory = asyncHandler(async (req, res, next) => {
  const mediaCategory = await MediaCategory.findById(req.params.id);

  if (!mediaCategory) {
    throw new MyError(
      req.params.id + " Тус мэдээний ангилал байхгүй байна.",
      404
    );
  }

  res.status(200).json({
    success: true,
    data: mediaCategory,
  });
});

exports.deletetMediaCategory = asyncHandler(async (req, res, next) => {
  const category = await MediaCategory.findById(req.params.id);
  if (!category) {
    throw new MyError(req.params.id + " ангилал байхгүй байна", 404);
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateMediaCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  delete req.body.name;

  req.body[req.cookies.language] = {
    name,
  };

  const category = await MediaCategory.findByIdAndUpdate(
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
