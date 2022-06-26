const express = require("express");
const router = express.Router();
var multer = require("multer");
const { protect, authorize } = require("../middleware/protect");
const UPLOAD_FILES_DIR = "public/upload";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_FILES_DIR);
    },
    // in case you want to change the names of your files)
    filename(req, file = {}, cb) {
        file.mimetype = "image/jpg";
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
        cb(null, `${file.fieldname}${Date.now()}${fileExtension}`);
    },
});

const upload = multer({ storage });

const { createProgram, getProgram, getAllProgram, getSlugProgram, getCountProgram, multDeleteProgram, updateProgram, getSingleProgram } = require("../controller/Program");

router
    .route("/")
    .post(protect, authorize("admin", "operator"), createProgram)
    .get(getProgram);


router.route("/c").get(getAllProgram);
router.route("/s/:slug").get(getSlugProgram);

router
    .route("/count")
    .get(protect, authorize("admin", "operator"), getCountProgram);
router.route("/delete").delete(protect, authorize("admin"), multDeleteProgram);
router
    .route("/:id")
    .get(getSingleProgram)
    .put(protect, authorize("admin", "operator"), updateProgram);

module.exports = router;
