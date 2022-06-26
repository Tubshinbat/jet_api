const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createPartner,
  getPartner,
  multDeletePartner,
  getPartners,
  updatePartner,
} = require("../controller/Partners");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createPartner)
  .get(getPartners);

router.route("/delete").delete(protect, authorize("admin"), multDeletePartner);

router
  .route("/:id")
  .get(getPartner)
  .put(protect, authorize("admin", "operator"), updatePartner);

module.exports = router;
