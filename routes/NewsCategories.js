const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createNewsCategory,
  getNewsCategories,
  getNewsCategory,
  deletetNewsCategory,
  updateNewsCategory,
} = require("../controller/NewsCategories");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createNewsCategory)
  .get(getNewsCategories);

// "/api/v1/News-categories/id"
router
  .route("/:id")
  .get(getNewsCategory)
  .delete(protect, authorize("admin"), deletetNewsCategory)
  .put(protect, authorize("admin", "operator"), updateNewsCategory);

module.exports = router;
