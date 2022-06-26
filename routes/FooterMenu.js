const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createMenu,
  getMenus,
  getMenu,
  deletetMenu,
  updateMenu,
  menuCount,
  getSlugMenu,
} = require("../controller/FooterMenu");

router
  .route("/")
  .post(protect, authorize("admin", "operator"), createMenu)
  .get(getMenus);

router.route("/count").get(protect, menuCount);
router.route("/slug/:slug").get(getSlugMenu);
// "/api/v1/News-categories/id"
router
  .route("/:id")
  .get(getMenu)
  .delete(protect, authorize("admin"), deletetMenu)
  .put(protect, authorize("admin", "operator"), updateMenu);

module.exports = router;
