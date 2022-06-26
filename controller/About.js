const About = require("../models/About");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const paginate = require("../utils/paginate");
const sharp = require("sharp");

exports.createAbout = asyncHandler(async (req, res, next) => {
  const image = req.files;
  if (!image) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  if (image.length > 1) {
    throw new MyError("Та зөвхөн нэг зураг оруулна уу", 500);
  }

  newFileUpload(image, "about")
    .then((fileName) => {
      newResizePhoto(fileName);
    })
    .catch((error) => {
      console.log(error);
    });

  req.body.picture = `${image.picture.name}`;
  req.body.createUser = req.userId;
  const about = await About.create(req.body);
  res.status(200).json({
    success: true,
    data: about,
  });
});

const newFileUpload = (fileData, id) => {
  return new Promise((resolve, reject) => {
    let files;
    files = fileData;
    const file = files.picture;
    file.name = `photo_${id}_${file.name}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (error) => {
      if (error) {
        reject("Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + error.message);
      }
      resolve(file.name);
    });
  });
};

const newResizePhoto = (file) => {
  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 900,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/450/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.getAbout = asyncHandler(async (req, res, next) => {
  const about = await About.findOne().sort({ createAt: -1 }).limit(1);
  if (!about) {
    throw new MyError("Хайсан мэдээлэл олдсонгүй", 400);
  }
  res.status(200).json({
    success: true,
    data: about,
  });
});

exports.updateAbout = asyncHandler(async (req, res, next) => {
  // req.headers.authorization

  let about = await About.findOne().sort({ createAt: -1 }).limit(1);

  if (!about) {
    throw new MyError("Хайсан мэдээлэл байхгүй байна...", 404);
  }

  const image = req.files;
  if (!image && !req.body.picture) {
    throw new MyError("Зураг оруулна уу", 400);
  }
  if (image) {
    if (image.length > 1) {
      throw new MyError("Та зөвхөн нэг зураг оруулна уу", 500);
    }
    newFileUpload(image, "about")
      .then((fileName) => {
        newResizePhoto(fileName);
      })
      .catch((error) => {
        console.log(error);
      });

    req.body.picture = `${image.picture.name}`;
  }
  req.body.updateUser = req.userId;

  about = await About.findByIdAndUpdate(about._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: about,
  });
});
