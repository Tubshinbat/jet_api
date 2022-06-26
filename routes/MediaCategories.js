const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createMediaCategory,
  getMediaCategories,
  getMediaCategory,
  deletetMediaCategory,
  updateMediaCategory,
} = require("../controller/MediaCategories");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createMediaCategory)
  .get(getMediaCategories);

// "/api/v1/Media-categories/id"
router
  .route("/:id")
  .get(getMediaCategory)
  .delete(protect, authorize("admin"), deletetMediaCategory)
  .put(protect, authorize("admin", "operator"), updateMediaCategory);

module.exports = router;
