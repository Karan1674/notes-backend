const express = require("express");
const { answerQuestion } = require("../controllers/pdfController");

const router = express.Router();

router.post("/ask", answerQuestion);

module.exports = router;