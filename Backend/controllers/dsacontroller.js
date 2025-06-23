const axios = require("axios");
const questions = require("../dsa/dsaquestions.json");
const Submission = require("../models/Submission");

exports.generateQuestion = (req, res) => {
  const { role, difficulty } = req.body;

  const filtered = questions.filter(
    (q) => q.role === role && q.difficulty === difficulty
  );

  if (filtered.length === 0) {
    return res.status(404).json({ message: "No question found." });
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  res.json({ question: random.question });
};

exports.compileCode = async (req, res) => {
  const { code, language, stdin } = req.body; // ✅ accept stdin from frontend

  const langMap = {
    cpp: 54,
    python: 71,
    java: 62,
    javascript: 63,
  };

  try {
    const response = await axios.post(
      process.env.JUDGE0_API,
      {
        language_id: langMap[language],
        source_code: code,
        stdin: stdin || "", // ✅ use stdin from user input
      },
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const output =
      response.data.stdout || response.data.compile_output || response.data.stderr || "✅ Code compiled.";

    res.json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.submitCode = async (req, res) => {
  const { code, language, question, stdin } = req.body; // ✅ accept stdin

  const langMap = {
    cpp: 54,
    python: 71,
    java: 62,
  };

  try {
    const execRes = await axios.post(
      process.env.JUDGE0_API,
      {
        language_id: langMap[language],
        source_code: code,
        stdin: stdin || "", // ✅ use stdin from frontend
      },
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const output = execRes.data.stdout || execRes.data.stderr || "No output";

    // Dummy feedback since OpenAI isn't integrated
    const feedback = "AI feedback not available (OpenAI disabled).";

    await Submission.create({
      question,
      code,
      language,
      output,
      feedback,
    });

    res.json({ output, feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Submission.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
