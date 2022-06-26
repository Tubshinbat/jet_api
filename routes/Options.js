const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createOption,
  getOptions,
  getOption,
} = require("../controller/Options");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createOption)
  .get(getOptions);

router.route("/:id").get(getOption);

module.exports = router;
