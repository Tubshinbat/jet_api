const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const sharp = require("sharp");

exports.videoUpload = (fileData, genName) => {
  return new Promise((resolve, reject) => {
    let fileName, file;
    file = fileData;
    file.name = `video_${genName}_${file.name}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (error) => {
      if (error) {
        reject("Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + error.message);
      }
      fileName = file.name;
      resolve({
        status: true,
        fileName,
      });
    });
  });
};

exports.fileUpload = (fileData, genName, is_picture = true) => {
  return new Promise((resolve, reject) => {
    let fileName, files;
    files = fileData;
    files.name = `photo_${genName}_${files.name}`;
    files.mv(`${process.env.FILE_UPLOAD_PATH}/${files.name}`, (error) => {
      if (error) {
        reject("Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + error.message);
      }
      fileName = files.name;
      if (is_picture) newResizePhoto(fileName);
      resolve({
        status: true,
        fileName,
      });
    });
  });
};

exports.imageDelete = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      fs.unlinkSync(process.env.FILE_UPLOAD_PATH + "/" + filePath);
      fs.unlinkSync(process.env.FILE_UPLOAD_PATH + "/150x150/" + filePath);
      fs.unlinkSync(process.env.FILE_UPLOAD_PATH + "/350x350/" + filePath);
      fs.unlinkSync(process.env.FILE_UPLOAD_PATH + "/450/" + filePath);
      resolve(true);
    } catch (error) {
      resolve(true);
    }
  });
};

exports.multDelete = () => {};

exports.multImages = (files, genName) => {
  return new Promise((resolve, reject) => {
    let fileName = [];
    let count = 1;
    try {
      files.pictures.map((file) => {
        file.name = `photo_${genName}_${file.name}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (error) => {
          error && reject("Файл хуулах явцад алдаа гарлаа" + error.message);
          fileName.push(file.name);
          newResizePhoto(file.name);
          count++;
          if (count === files.pictures.length + 1) {
            resolve(fileName);
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.multFile = (files, genName) => {
  return new Promise((resolve, reject) => {
    let fileName = [];
    let count = 1;
    try {
      files.map((file) => {
        file.name = `file_${genName}_${file.name}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (error) => {
          error && reject("Файл хуулах явцад алдаа гарлаа" + error.message);
          fileName.push(file.name);

          count++;
          if (count === files.length + 1) {
            resolve(fileName);
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

const newResizePhoto = (file) => {
  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 150,
      height: 150,
      fit: sharp.fit.cover,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/150x150/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped 150" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err + "150");
    });

  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 300,
      height: 300,
      fit: sharp.fit.cover,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/350x350/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped 300 " + newFileInfo);
    })
    .catch(function (err) {
      console.log(err + "300");
    });

  sharp(`${process.env.FILE_UPLOAD_PATH}/${file}`)
    .resize({
      width: 450,
    })
    .toFile(`${process.env.FILE_UPLOAD_PATH}/450/${file}`)
    .then(function (newFileInfo) {
      console.log("img croped 450" + newFileInfo);
    })
    .catch(function (err) {
      console.log(err + "450");
    });
};
