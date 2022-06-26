const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createPage,
  getPage,
  getPages,
  getCountPages,
  getSlug,
  multDeletePages,
  updatePage,
  getMenuData,
  getFooterData,
} = require("../controller/Page");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createPage)
  .get(getPages);

router.route("/slug/:slug").get(getSlug);
router.route("/menu/:id").get(getMenuData);
router.route("/footermenu/:id").get(getFooterData);

router
  .route("/count")
  .get(protect, authorize("admin", "operator"), getCountPages);

router.route("/delete").delete(protect, authorize("admin"), multDeletePages);
router
  .route("/:id")
  .get(getPage)
  .put(protect, authorize("admin", "operator"), updatePage);

module.exports = router;
