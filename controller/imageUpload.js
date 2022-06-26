const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const { writeFileSync } = require("fs");
const sharp = require("sharp");

const fileUpload = (fileData, id) => {
  return new Promise((resolve, reject) => {
    let fileName, files;
    files = fileData.file;
    files.name = `photo_${id}_${files.name}`;
    files.mv(`${process.env.FILE_UPLOAD_PATH}/${files.name}`, (error) => {
      if (error) {
        reject("Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + error.message);
      }
      fileName = files.name;
      resolve(fileName);
    });
  });
};

const resizePhoto = (file) => {
  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 150,
      height: 150,
      fit: sharp.fit.cover,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/150x150/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });

  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 300,
      height: 300,
      fit: sharp.fit.cover,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/350x350/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });

  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 450,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/450/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.imageUpload = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let file = "";
  if (!files) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  fileUpload(files, "img").then((fileName) => {
    file = fileName;
    resizePhoto(file);
  });

  res.status(200).json({
    success: true,
    data: file,
  });
});

exports.travelImgUpload = asyncHandler(async (req, res, next) => {
  const images = req.files;
  const id = req.params.id;
  let image = "";
  if (!images) {
    throw new MyError("Та зураг оруулна уу.", 400);
  }
  // console.log(images);
  newFileUpload(images, id)
    .then((fileName) => {
      file = fileName;
      res.status(200).json({
        success: true,
        data: file,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error,
      });
    });
});

const multFileUpload = (files, id) => {
  return new Promise((resolve, reject) => {
    let fileName = [];
    let count = 1;

    files.picturesData.map((file) => {
      file.name = `photo_${id}_${file.name}`;
      file.mv(
        `${process.env.FILE_TRAVEL_UPLOAD_PATH}/${file.name}`,
        (error) => {
          if (error) {
            reject("Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + error.message);
          }
          count++;
          newResizePhoto(file.name);
          fileName.push(file.name);
          if (count === files.picturesData.length + 1) {
            resolve(fileName);
          }
        }
      );
    });
  });
};

const newFileUpload = (fileData, id) => {
  return new Promise((resolve, reject) => {
    let files;
    let fileName = [];
    files = fileData;
    if (files.picturesData.length > 1) {
      multFileUpload(files, id).then((fileName) => resolve(fileName));
    } else {
      const file = files.picturesData;
      file.name = `photo_${id}_${file.name}`;
      file.mv(
        `${process.env.FILE_TRAVEL_UPLOAD_PATH}/${file.name}`,
        (error) => {
          if (error) {
            reject("Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + error.message);
          }
          fileName.push(file.name);
          newResizePhoto(file.name);
          resolve(fileName);
        }
      );
    }
  });
};

const newResizePhoto = (file) => {
  sharp(`${process.env.FILE_TRAVEL_UPLOAD_PATH}/${file}`)
    .resize({
      width: 150,
      height: 150,
      fit: sharp.fit.cover,
    })
    .toFile(`${process.env.FILE_TRAVEL_UPLOAD_PATH}/150x150/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });

  sharp(`${process.env.FILE_TRAVEL_UPLOAD_PATH}/${file}`)
    .resize({
      width: 300,
      height: 300,
      fit: sharp.fit.cover,
    })
    .toFile(`${process.env.FILE_TRAVEL_UPLOAD_PATH}/350x350/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });

  sharp(`${process.env.FILE_TRAVEL_UPLOAD_PATH}/${file}`)
    .resize({
      width: 450,
    })
    .toFile(`${process.env.FILE_TRAVEL_UPLOAD_PATH}/450/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err);
    });
};

const deleteFile = (filePaths) => {
  if (filePaths.length > 0) {
    filePaths.map((filePath) => {
      try {
        fs.unlinkSync(process.env.FILE_UPLOAD_PATH + "/" + filePath);
      } catch (error) {
        console.log(error);
      }
    });
  }
};
