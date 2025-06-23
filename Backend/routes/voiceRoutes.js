const express = require("express");
const router = express.Router();
const multer = require("multer");
const voiceController = require("../controllers/voiceController");

const upload = multer({ dest: "uploads/" });

router.post("/process", upload.single("audio"), voiceController.processVoiceAnswer);

module.exports = router;

