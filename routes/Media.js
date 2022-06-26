const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createMedia,
  getMedia,
  multDeleteMedia,
  getSingleMedia,
  updateMedia,
  getCountMedia,
  getAllMedia,
  getTags,
  getSlugMedia,
  updateView,
} = require("../controller/Media");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createMedia)
  .get(getMedia);

router.route("/tags").get(getTags);
router.route("/c").get(getAllMedia);
router.route("/s/:slug").get(getSlugMedia);
router.route("/view/:slug").get(updateView);

router
  .route("/count")
  .get(protect, authorize("admin", "operator"), getCountMedia);
router.route("/delete").delete(protect, authorize("admin"), multDeleteMedia);
router
  .route("/:id")
  .get(getSingleMedia)
  .put(protect, authorize("admin", "operator"), updateMedia);

module.exports = router;
