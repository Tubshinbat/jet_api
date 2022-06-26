const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  updateFact,
  createFact,
  getFacts,
  getCountFact,
  multDeleteFacts,
  getFact,
} = require("../controller/Fact");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createFact)
  .get(getFacts);

router
  .route("/count")
  .get(protect, authorize("admin", "operator"), getCountFact);
router.route("/delete").delete(protect, authorize("admin"), multDeleteFacts);
router
  .route("/:id")
  .get(getFact)
  .put(protect, authorize("admin", "operator"), updateFact);

module.exports = router;
