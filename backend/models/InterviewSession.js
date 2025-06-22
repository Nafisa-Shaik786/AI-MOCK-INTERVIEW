const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    resume: String,
    jobDescription: String,
    questions:[String],
    answers:[{
        question: String,
        answer: String,
        feedback: String,
        score: Number
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);