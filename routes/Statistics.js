const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getStatistics,
  createStatistics,
  getSingleStatistics,
  deleteStatistic,
  updateStatistics,
  getActive,
} = require("../controller/Statistics");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createStatistics)
  .get(getStatistics);

router.route("/active").get(getActive);

router
  .route("/:id")
  .get(getSingleStatistics)
  .delete(protect, authorize("admin"), deleteStatistic)
  .put(protect, authorize("admin", "operator"), updateStatistics);

module.exports = router;
