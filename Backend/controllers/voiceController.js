const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.processVoiceAnswer = async (req, res) => {
  try {
    const { question } = req.body;
    const audioFilePath = req.file.path;

    // 1. Get expected answer
    const expectedRes = await axios.post("https://voicescore2.onrender.com/expected-answer/", {
      question,
    });
    const expectedAnswer = expectedRes.data.expected_answer;

    // 2. Send audio file for transcription
    const formData = new FormData();
    formData.append("audio", fs.createReadStream(audioFilePath));

    const transcriptRes = await axios.post("https://voicescore2.onrender.com/voice-to-text/", formData, {
      headers: formData.getHeaders(),
    });
    const userText = transcriptRes.data.text;

    // 3. Compare expected and actual
    const compareRes = await axios.post("https://voicescore2.onrender.com/compare/", {
      question,
      expected_answer: expectedAnswer,
      user_answer: userText,
    });

    // 4. Return final response
    res.json({
      question,
      expected: expectedAnswer,
      actual: userText,
      feedback: compareRes.data.feedback,
      domain_scores: compareRes.data.domain_scores,
    });

    // Optional: delete uploaded file after processing
    fs.unlink(audioFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

  } catch (error) {
    console.error("Voice processing error:", error.message);
    res.status(500).json({ error: "Something went wrong during voice evaluation." });
  }
};
