const express = require("express");
const router = express.Router();
const { getGeminiFeedback } = require("../controllers/geminiFeedbackController");

router.post("/get-gemini-feedback", getGeminiFeedback);

module.exports = router;
