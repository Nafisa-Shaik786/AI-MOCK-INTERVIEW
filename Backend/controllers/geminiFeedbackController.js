const axios = require("axios");

exports.getGeminiFeedback = async (req, res) => {
try {
const { scores } = req.body;

  if (!scores || typeof scores !== "object") {
  return res.status(400).json({ error: "Missing or invalid scores object" });
}

const response = await axios.post(
  "https://feedbackgenerator-yz6t.onrender.com/analyze_scores/",
  { scores },
 {
    timeout: 120000 // 2 minutes
  }
);

return res.status(200).json(response.data);
  
} catch (error) {
console.error("Gemini Feedback Error:", error.message);
if (error.response?.data) {
return res.status(500).json({ error: error.response.data });
}
return res.status(500).json({ error: "Something went wrong with Gemini API" });
}
};
