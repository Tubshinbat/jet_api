const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getSlugEmployee,
  createEmployee,
  getEmployees,
  getCountEmployee,
  multDeleteEmployees,
  getEmployee,
  updateEmployee,
} = require("../controller/Employee");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createEmployee)
  .get(getEmployees);

router.route("/s/:slug").get(getSlugEmployee);

router
  .route("/count")
  .get(protect, authorize("admin", "operator"), getCountEmployee);
router
  .route("/delete")
  .delete(protect, authorize("admin"), multDeleteEmployees);

router
  .route("/:id")
  .get(getEmployee)
  .put(protect, authorize("admin", "operator"), updateEmployee);

module.exports = router;
