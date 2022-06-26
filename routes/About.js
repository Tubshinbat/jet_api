const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();

const { createAbout, getAbout, updateAbout } = require("../controller/About");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createAbout)
  .get(getAbout);
router.route("/:id").put(protect, authorize("admin", "operator"), updateAbout);

module.exports = router;
