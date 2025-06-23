const express = require('express');
const router = express.Router();
const{startInterview, submitAnswer}=require('../controllers/InterviewController');
const authMiddleware = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');

router.post('/start',  async (req, res) => {
  console.log('Received /start request ✅');
  const { resume, jobDescription } = req.body;
  console.log('Request body:', req.body);

  const questions = [
    "Tell me about yourself.",
    "Why are you interested in this role?",
    "What are your strengths and weaknesses?"
  ];

  // ✅ Send response to Postman
  res.status(200).json({
    message: "Interview started",
    sessionId: "mock-session-id-123",
    questions
  });
});

router.post('/submit',  async (req, res) => {
  console.log('Received /submit request ✅');
  const { sessionId, question, answer } = req.body;
  console.log('Submitting answer for session:', sessionId);
   const score = Math.floor(Math.random() * 100);
  const feedback = "Great effort! Work on explaining your projects in more detail.";

  res.status(200).json({
    message: "Interview submitted",
    score,
    feedback
  });
});


module.exports = router;