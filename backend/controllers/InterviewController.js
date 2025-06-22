const InterviewSession = require('../models/InterviewSession');

exports.startInterview = async (req, res) => {
    try{
        const{resume, jobDescription, questions} = req.body;
        const question=[
            "Tell me about yourself.",
            "What are your strengths and weaknesses?",
            "Why do you want to work here?",
            "Describe a challenging situation and how you handled it.",
            "Where do you see yourself in five years?"
        ];

const interviewSession = new InterviewSession({
            user: req.user._id,
            resume,
            jobDescription,
            questions,
        });

    await interviewSession.save();
        res.status(201).json({ message: "Interview session started successfully", interviewSession });  
    }
    catch(err){
        res.status(500).json({ message: "Error starting interview session", error: err.message });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { interviewId, question, answer} = req.body;

    const feedback = "Great answer! Try to be a bit more concise.";
    const score = Math.floor(Math.random() * 5) + 1;

    const session = await InterviewSession.findById(interviewId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.answers.push({ question, answer, feedback, score });
    await session.save();

    res.status(200).json({ message: 'Answer submitted', feedback, score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }};