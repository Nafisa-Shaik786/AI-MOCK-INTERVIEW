const express = require("express");
const router = express.Router();
const { generateQuestion, submitCode, compileCode, getHistory } = require("../controllers/dsacontroller");

router.post("/generate-question", generateQuestion);
router.post("/submit-code", submitCode);
router.post("/compile-code", compileCode);
router.get("/history", getHistory);

module.exports = router;
