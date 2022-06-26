const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createBanner,
  getBanner,
  getBanners,
  multDeleteBanner,
  updateBanner,
  getCounBanner,
} = require("../controller/Banners");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createBanner)
  .get(getBanners);

router
  .route("/count")
  .get(protect, authorize("admin", "operator"), getCounBanner);

router.route("/delete").delete(protect, authorize("admin"), multDeleteBanner);
router
  .route("/:id")
  .get(getBanner)
  .put(protect, authorize("admin", "operator"), updateBanner);

module.exports = router;
