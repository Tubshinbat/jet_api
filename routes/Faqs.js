const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createFaq,
  deleteFaq,
  getFaq,
  updateFaq,
} = require("../controller/Faqs");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createFaq)
  .get(getFaq);

router
  .route("/:id")
  .delete(protect, authorize("admin", "operator"), deleteFaq)
  .put(protect, authorize("admin", "operator"), updateFaq);

module.exports = router;
