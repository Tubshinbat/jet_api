const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createStatisticsSub,
  getStatisticsSub,
  getSingleStatisticsSub,
  deleteStatisticSub,
  updateStatisticsSub,
} = require("../controller/Statistics_sub");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createStatisticsSub)
  .get(getStatisticsSub);

router
  .route("/:id")
  .get(getSingleStatisticsSub)
  .delete(protect, authorize("admin"), deleteStatisticSub)
  .put(protect, authorize("admin", "operator"), updateStatisticsSub);

module.exports = router;
