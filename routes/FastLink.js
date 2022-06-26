const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  updateFastLink,
  createFastLink,
  getFastLinks,
  multDeleteFastLink,
  getFastLink,
} = require("../controller/FastLink");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createFastLink)
  .get(getFastLinks);

// router.route("/s/:slug").get(getSlugNews);

router.route("/delete").delete(protect, authorize("admin"), multDeleteFastLink);
router
  .route("/:id")
  .get(getFastLink)
  .put(protect, authorize("admin", "operator"), updateFastLink);

module.exports = router;
