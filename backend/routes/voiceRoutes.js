const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/voice-to-text", upload.single("audio"), async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;

    // Dummy response (replace with actual STT model later)
    const transcript = "This is a dummy transcription";
    const evaluation = "Good clarity and tone!";

    res.json({ transcript, evaluation });
  } catch (err) {
    console.error("Error processing audio:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
