const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  updateTopLink,
  createTopLink,
  getTopLinks,
  multDeleteTopLink,
  getTopLink,
  getSlugTopLink,
} = require("../controller/TopLink");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createTopLink)
  .get(getTopLinks);

router.route("/slug/:slug").get(getSlugTopLink);

router.route("/delete").delete(protect, authorize("admin"), multDeleteTopLink);
router
  .route("/:id")
  .get(getTopLink)
  .put(protect, authorize("admin", "operator"), updateTopLink);

module.exports = router;
