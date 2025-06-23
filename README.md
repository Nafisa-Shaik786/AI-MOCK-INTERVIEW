AI Mock Interview
An AI-powered mock interview platform designed to simulate real interview scenarios, generate personalized questions, and give performance-based feedback. Built with Next.js, Tailwind CSS, PostgreSQL, and Gemini API.

🚀 Features
🎤 AI Interview Simulation — Real-time question generation and evaluation using Gemini API

👩‍💻 Role & Stack-Based Interviews — Customize by job role, experience, and tech stack

🧾 Score & Feedback Analysis — Get detailed scores: correctness, communication, confidence

🔁 Interview History — View past sessions with full feedback reports

📊 Voice Analysis — Integrates energy and pitch analysis for better feedback (Librosa)

🛠 Tech Stack
Layer	Tech
Frontend	Next.js, Tailwind CSS
Backend/API	Node.js, Express, Gemini API, Flask (voice scoring)
Database	PostgreSQL via Drizzle ORM
AI Models	Gemini for Q&A, Mixtral (HuggingFace) for scoring
Voice	Python (Flask), Librosa, Whisper, SpeechRecognition

🗂 Project Structure
graphql
Copy
Edit
AI-MOCK-INTERVIEW/
│
├── app/                     # Next.js App Router pages & layouts
│   ├── interview/           # Interview flow UI
│   └── dashboard/           # User dashboard with history
│
├── components/              # Reusable UI components
│   ├── InterviewPanel.tsx
│   └── FeedbackCard.tsx
│
├── controllers/             # Backend logic (Node.js/Express)
│   └── dsacontroller.js     # DSA code submission & feedback logic
│
├── dsa/                     # DSA question bank (JSON)
│   └── dsaquestions.json
│
├── lib/                     # Drizzle ORM & DB config
│   └── db.ts
│
├── public/                  # Static assets (icons, images)
│
├── routes/                  # Express routes for DSA & interview
│   └── dsaRoutes.js
│
├── utils/                   # Helper functions (prompts, scoring)
│   └── promptUtils.ts
│
├── voice-api/               # Python (Flask) service for voice scoring
│   ├── app.py
│   ├── voicepart.py         # Pitch & energy analysis
│   └── requirements.txt
│
├── .env.local.example       # Sample environment config
├── drizzle.config.ts        # DB schema definition
├── package.json
└── README.md
⚙️ Getting Started
1. Clone & Install
bash
Copy
Edit
git clone https://github.com/Nafisa-Shaik786/AI-MOCK-INTERVIEW.git
cd AI-MOCK-INTERVIEW
npm install
2. Set Up Environment Variables
Create a .env.local file:

env
Copy
Edit
GEMINI_API_KEY=your_key
DATABASE_URL=postgres://...
VOICE_FEEDBACK_API=https://interview-linkedin-project-ml-part-2.onrender.com/evaluate
3. Run the Dev Server
bash
Copy
Edit
npm run dev
📘 How to Use
Choose a job role, experience level, and tech stack

Answer AI-generated questions (text or voice)

Review your feedback (correctness, communication, confidence)

Revisit past sessions from your dashboard

