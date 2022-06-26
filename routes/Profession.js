const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createProfession,
  getProfession,
  getProfessions,
  deleteProfession,
  updateProfession,
} = require("../controller/Profession");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createProfession)
  .get(getProfessions);

// "/api/v1/News-categories/id"
router
  .route("/:id")
  .get(getProfession)
  .delete(protect, authorize("admin"), deleteProfession)
  .put(protect, authorize("admin", "operator"), updateProfession);

module.exports = router;
