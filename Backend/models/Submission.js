const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  question: String,
  code: String,
  language: String,
  output: String,
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("submission", SubmissionSchema);
