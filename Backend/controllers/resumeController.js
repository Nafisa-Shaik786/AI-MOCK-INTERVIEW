const axios = require("axios");
const FormData = require("form-data");

exports.generateQuestionsFromResume = async (req, res) => {
  try {
    const file = req.file;
   if (!file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }


  const form = new FormData();
    form.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      "https://llmquestion.onrender.com/generate-questions/",
      form,
      { headers: form.getHeaders() }
    );

    const data = response.data;
if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json({ questions: data.questions });

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.response) {
      console.error("Backend error:", err.response.data);
      return res.status(500).json({ error: err.response.data });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
