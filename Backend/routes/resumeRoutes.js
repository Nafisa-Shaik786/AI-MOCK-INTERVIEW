const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Use in-memory for small files

const { generateQuestionsFromResume } = require("../controllers/resumeController");

router.post("/upload-resume", upload.single("file"), generateQuestionsFromResume);

module.exports = router;
