const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createContact,
  getContacts,
  multDeleteContact,
  getContact,
} = require("../controller/Contact");

router
  .route("/")
  .post(createContact)
  .get(protect, authorize("admin", "operator"), getContacts);

router.route("/delete").delete(protect, authorize("admin"), multDeleteContact);

router.route("/:id").get(protect, authorize("admin", "operator"), getContact);

module.exports = router;
