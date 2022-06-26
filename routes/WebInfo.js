const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createWebInfo,
  getWebinfo,
  updateWebInfo,
} = require("../controller/WebInfo");

router.route("/").post(createWebInfo).get(getWebinfo);

router
  .route("/:id")
  .put(protect, authorize("admin", "operator"), updateWebInfo);

module.exports = router;
