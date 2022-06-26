const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const { imageUpload, travelImgUpload } = require("../controller/imageUpload");

router.route("/").post(protect, authorize("admin", "operator"), imageUpload);
router
  .route("/travel/:id")
  .post(protect, authorize("admin", "operator"), travelImgUpload);

module.exports = router;
