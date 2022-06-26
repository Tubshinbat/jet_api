const WebInfo = require("../models/Webinfo");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const { fileUpload, imageDelete } = require("../lib/photoUpload");

exports.createWebInfo = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const address = req.body.address;
  const siteInfo = req.body.siteInfo;
  const policy = req.body.policy;
  const lang = req.cookies.language || "mn";
  let logo, whiteLogo;

  ["name", "address", "siteInfo", "policy"].map((el) => delete req.body[el]);

  req.body[lang] = {
    name,
    address,
    siteInfo,
    policy,
  };

  const files = req.files;

  if (files) {
    if (files.logo) {
      logo = await fileUpload(files.logo, "logo").catch((error) => {
        throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
      });
    } else {
      throw new MyError("Лого оруулна уу", 402);
    }
    if (files.whiteLogo) {
      whiteLogo = await fileUpload(files.whiteLogo, "whitelogo").catch(
        (error) => {
          throw new MyError(`Зураг хуулах явцад алдаа гарлаа: ${error}`, 408);
        }
      );
    }
  }

  req.body[lang].logo = logo.fileName;
  req.body[lang].whiteLogo = whiteLogo.fileName || "";
  req.body.updateUser = req.userId;

  ["logo", "whiteLogo", "name", "address", "siteInfo", "policy"].forEach(
    (el) => delete req.body[el]
  );

  // console.log(req);

  let webInfo = await WebInfo.create(req.body);

  res.status(200).json({
    success: true,
    data: webInfo,
  });
});

exports.getWebinfo = asyncHandler(async (req, res, next) => {
  const webInfo = await WebInfo.findOne().sort({ updateAt: -1 });
  if (!webInfo) {
    throw new MyError("Хайсан мэдээлэл олдсонгүй", 400);
  }
  res.status(200).json({
    success: true,
    data: webInfo,
  });
});

exports.updateWebInfo = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let logo = req.body.logo;
  let whiteLogo = req.body.whiteLogo;

  let newLogo = "";
  let newWhiteLogo = "";

  const name = req.body.name;
  const address = req.body.address;
  const siteInfo = req.body.siteInfo;
  const policy = req.body.policy;
  const lang = req.cookies.language || "mn";

  if (files) {
    if (files.logo) {
      newLogo = await fileUpload(files.logo, "logo").catch((error) => {
        throw new MyError(`Лого хуулах явцад алдаа гарлаа: ${error}`, 408);
      });
      logo = newLogo.fileName;
    }
    if (files.whiteLogo) {
      newWhiteLogo = await fileUpload(files.whiteLogo, "logo").catch(
        (error) => {
          throw new MyError(`Лого хуулах явцад алдаа гарлаа: ${error}`, 408);
        }
      );
      whiteLogo = newWhiteLogo.fileName;
    }
  }

  ["logo", "whiteLogo", "name", "address", "siteInfo", "policy", "_id"].forEach(
    (el) => delete req.body[el]
  );

  lang === "eng" ? delete req.body.mn : delete req.body.eng;

  req.body[lang] = {
    name,
    address,
    siteInfo,
    policy,
  };

  req.body[lang].logo = logo;
  req.body[lang].whiteLogo = whiteLogo || "";

  const webInfo = await WebInfo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!webInfo) {
    throw new MyError("Уучлаарай амжилттгүй боллоо", 404);
  }

  res.status(200).json({
    success: true,
    data: webInfo,
  });
});
