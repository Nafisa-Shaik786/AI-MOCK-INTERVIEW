# 🎤 AI Mock Interview

> An AI-powered mock interview platform that simulates real interview scenarios, generates **resume-based personalized questions**, evaluates **text and voice answers**, runs an **adaptive coding round**, and gives performance-based feedback with a **learning roadmap**.

Built for the **Feminnovate AI – LinkedIn Coaching Hackathon**.

---

## 📑 Table of Contents

- [Why this project?](#-why-this-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Demo](#-demo)
- [System Workflow (UML)](#-system-workflow-uml)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Future Scope](#-future-scope)
- [Team](#-team)

---

## 💡 Why this project?

Existing learning platforms offer structured courses but lack:

| Gap | Our answer |
|---|---|
| No resume-to-interview intelligence | Questions generated from the candidate's actual resume + job description |
| No realistic interview simulation | Voice-based answers with pitch and energy analysis |
| No smart feedback | Scores on correctness, communication and confidence |
| Generic course suggestions | Learning roadmap driven by the user's weak areas |

---

## ✨ Key Features

- **AI-generated questions** based on job role, experience level, tech stack and resume.
- **Real-time answer evaluation** using the Gemini API.
- **Customizable interview settings** (job role, experience level, tech stack).
- **Detailed feedback** on correctness, communication and confidence.
- **Voice-based interviews** with pitch and energy analysis using **Librosa**.
- **Voice-to-text transcription** using **Whisper** and **SpeechRecognition**.
- **Adaptive coding round** (DSA question generator).
- **Interview history** with complete feedback reports on a dashboard.
- **Personalized learning roadmap** (1-month plan, LinkedIn Learning course suggestions).

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, Tailwind CSS (Vite + React for the DSA module) |
| **Backend / API** | Node.js, Express.js, Flask (Python) |
| **Database** | PostgreSQL (via Drizzle ORM) |
| **AI Models** | Gemini (question & expected-answer generation, evaluation) · Mixtral via HuggingFace (feedback scoring) · Whisper (speech-to-text) · Librosa (voice analysis) |

---

## 📸 Demo

### 🎙️ Voice-Based Interview
Resume-aware questions with a countdown timer. Record your answer, then get the transcription and AI evaluation.

![Voice Interview](voice-interview.png)

### 💻 Coding Round
Adaptive code challenge with language/theme selection, timer, compile and submit, and past submissions.

![Code Challenge](code-challenge.png)

---

## 🔄 System Workflow (UML)

> Diagrams are written in [Mermaid](https://mermaid.js.org/) and render automatically on GitHub.

### 1. End-to-End User Flow (Activity Diagram)

```mermaid
flowchart TD
    A([Start]) --> B[Login / Register]
    B --> C[Upload Resume + Enter Job Description]
    C --> D[Select Role, Experience Level, Tech Stack]
    D --> E[LLM generates personalized questions]
    E --> F{Answer mode?}
    F -- Text --> G[User types answer]
    F -- Voice --> H[User records voice answer]
    H --> I[Whisper / SpeechRecognition: speech to text]
    H --> J[Librosa: pitch and energy analysis]
    G --> K[Gemini: evaluate vs expected answer]
    I --> K
    J --> K
    K --> L[Scoring and feedback: correctness, communication, confidence]
    L --> M{More questions?}
    M -- Yes --> F
    M -- No --> N[Coding Round]
    N --> O[Skill-gap detection]
    O --> P[Learning roadmap and course recommendations]
    P --> Q[(Save session to history)]
    Q --> R([Dashboard: review past interviews])
```

### 2. Sequence Diagram – One Interview Question

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant FE as Frontend (Next.js)
    participant API as Node/Express API
    participant PY as Flask Services (Python)
    participant G as Gemini API
    participant W as Whisper
    participant L as Librosa
    participant M as Mixtral (HuggingFace)
    participant DB as PostgreSQL (Drizzle)

    U->>FE: Upload resume, JD, role, experience, tech stack
    FE->>API: POST /interview/start
    API->>PY: Parse resume + JD
    PY->>G: Generate personalized questions
    G-->>PY: Questions + expected answers
    PY-->>API: Question set
    API->>DB: Save interview session
    API-->>FE: First question

    U->>FE: Answer (text or voice)
    alt Voice answer
        FE->>PY: Audio file
        PY->>W: Transcribe audio
        W-->>PY: Transcript
        PY->>L: Extract pitch + energy
        L-->>PY: Voice metrics
    else Text answer
        FE->>API: Answer text
    end

    API->>G: Evaluate answer vs expected answer
    G-->>API: Correctness score + critique
    API->>M: Generate feedback score
    M-->>API: Communication + confidence feedback
    API->>DB: Save answer, scores, feedback
    API-->>FE: Feedback for this question
    FE-->>U: Show score and tips
```

### 3. Component Diagram

```mermaid
flowchart LR
    subgraph Client
        FE[Next.js + Tailwind UI]
        DSAUI[DSA Round UI - Vite/React]
    end

    subgraph Backend
        API[Node.js + Express API]
        AUTH[Auth Middleware]
        CTRL[Controllers / Routes]
    end

    subgraph PythonServices[Python Services - Flask/FastAPI]
        RQ[Resume Question Generator]
        VS[Voice Score Generator]
        DSA[DSA Question Generator]
    end

    subgraph AI[AI Models]
        GEM[Gemini API]
        MIX[Mixtral - HuggingFace]
        WH[Whisper + SpeechRecognition]
        LIB[Librosa]
    end

    DB[(PostgreSQL + Drizzle ORM)]

    FE --> API
    DSAUI --> API
    API --> AUTH
    API --> CTRL
    CTRL --> RQ
    CTRL --> VS
    CTRL --> DSA
    RQ --> GEM
    DSA --> GEM
    VS --> WH
    VS --> LIB
    CTRL --> GEM
    CTRL --> MIX
    CTRL --> DB
```

### 4. Class Diagram (Core Data Model)

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string passwordHash
        +register()
        +login()
    }
    class Resume {
        +int id
        +string fileUrl
        +string extractedSkills
        +string jobDescription
    }
    class InterviewSession {
        +int id
        +string jobRole
        +string experienceLevel
        +string techStack
        +datetime createdAt
        +float overallScore
        +start()
        +complete()
    }
    class Question {
        +int id
        +string text
        +string expectedAnswer
        +string type
    }
    class Answer {
        +int id
        +string transcript
        +string audioUrl
        +float pitchScore
        +float energyScore
        +float correctnessScore
        +float communicationScore
        +float confidenceScore
        +string feedback
    }
    class CodingRound {
        +int id
        +string problemStatement
        +string difficulty
        +float score
    }
    class LearningRoadmap {
        +int id
        +string weakAreas
        +string oneMonthPlan
        +string courseLinks
    }

    User "1" --> "many" Resume : uploads
    User "1" --> "many" InterviewSession : takes
    InterviewSession "1" --> "many" Question : contains
    Question "1" --> "1" Answer : receives
    InterviewSession "1" --> "0..1" CodingRound : includes
    InterviewSession "1" --> "0..1" LearningRoadmap : produces
    Resume "1" --> "many" InterviewSession : drives
```

### 5. State Diagram – Interview Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created : User starts interview
    Created --> QuestionsGenerated : LLM generates questions
    QuestionsGenerated --> Answering : Show question
    Answering --> Evaluating : Answer submitted (text / voice)
    Evaluating --> Answering : Next question
    Evaluating --> CodingRound : All questions answered
    CodingRound --> ReportReady : Code evaluated
    ReportReady --> RoadmapGenerated : Skill gaps detected
    RoadmapGenerated --> Saved : Stored in history
    Saved --> [*]
```

---

## 📁 Project Structure

```
AI-MOCK-INTERVIEW/
├── Backend/                         # Node.js + Express API
│   ├── controllers/
│   ├── dsa/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── src/
│   ├── server.js
│   └── package.json
│
├── DSAquestions-main/
│   └── DSA-Questions-Generator-AI-MOCK-INTERVIEW/   # Coding round (React + Vite + Tailwind)
│
├── LLMQuestion-main/
│   └── Resume-Question-Generator-AI-MOCK-INTERVIEW/ # Resume → questions (Python)
│       ├── main.py
│       └── requirements.txt
│
├── Voicescore2-main/
│   └── Voice-Score-Generator-AI-MOCK-INTERVIEW/     # Whisper + Librosa scoring (Python)
│       ├── main.py
│       ├── models.py
│       └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL
- A Gemini API key and a HuggingFace token
- `ffmpeg` (required by Whisper)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd AI-MOCK-INTERVIEW
```

### 2. Configure environment variables

Create a `.env` (or `env.local`) file in `Backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mockinterview
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_token
JWT_SECRET=your_jwt_secret
PORT=5000
```

> ⚠️ Never commit real keys. Add `.env*` to `.gitignore`.

### 3. Start the Node.js backend

```bash
cd Backend
npm install
npm run dev        # or: node server.js
```

### 4. Start the Python services

```bash
# Resume question generator
cd LLMQuestion-main/Resume-Question-Generator-AI-MOCK-INTERVIEW
pip install -r requirements.txt
python main.py

# Voice score generator (new terminal)
cd Voicescore2-main/Voice-Score-Generator-AI-MOCK-INTERVIEW
pip install -r requirements.txt
python main.py
```

### 5. Start the frontend(s)

```bash
# DSA / coding round UI
cd DSAquestions-main/DSA-Questions-Generator-AI-MOCK-INTERVIEW
npm install
npm run dev
```

---

## 🧭 How to Use

1. **Select** your desired job role, experience level, and tech stack (and upload your resume + JD).
2. **Start** the mock interview with AI-generated questions.
3. **Respond** using either text input or voice input.
4. **Receive** detailed feedback based on correctness, communication, and confidence.
5. **Visit the dashboard** to review your past interview sessions and learning roadmap.

---

## 🔮 Future Scope

- 🔗 **LinkedIn integration** – auto-fetch resume and recommend LinkedIn Learning courses.
- 🏅 **Skill badges & certifications** for mastering interview types (HR, DSA, System Design).
- ❓ **Dynamic follow-up questions** based on the candidate's answers.
- 🏢 **Company-specific interview sets** (e.g., LinkedIn, Google, Amazon).

---

## 👩‍💻 Team

**Feminnovate AI** — Sanika · Nafisa · Samriddhi · Shruti · Priya

---

## 📄 License

This project is licensed under the MIT License.