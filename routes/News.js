const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createNews,
  getNews,
  multDeleteNews,
  getSingleNews,
  updateNews,
  getCountNews,
  getAllNews,
  getTags,
  getSlugNews,
  updateView,
} = require("../controller/News");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createNews)
  .get(getNews);

router.route("/tags").get(getTags);
router.route("/c").get(getAllNews);
router.route("/s/:slug").get(getSlugNews);
router.route("/view/:slug").get(updateView);

router
  .route("/count")
  .get(protect, authorize("admin", "operator"), getCountNews);
router.route("/delete").delete(protect, authorize("admin"), multDeleteNews);
router
  .route("/:id")
  .get(getSingleNews)
  .put(protect, authorize("admin", "operator"), updateNews);

module.exports = router;
