const express = require("express");
const multer = require("multer");
const { processFile } = require("../controllers/textProcessingController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/process", upload.single("file"), processFile);

module.exports = router;
