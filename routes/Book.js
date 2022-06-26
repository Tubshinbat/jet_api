const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createBook,
  getBooks,
  multDeleteBook,
  getBook,
  updateBook,
} = require("../controller/Book");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createBook)
  .get(getBooks);

router.route("/delete").delete(protect, authorize("admin"), multDeleteBook);
router
  .route("/:id")
  .get(getBook)
  .put(protect, authorize("admin", "operator"), updateBook);

module.exports = router;
