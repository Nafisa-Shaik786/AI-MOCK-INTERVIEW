import React, { useEffect, useRef, useState } from "react";
import Section from "../components/Section";
import { useNavigate } from "react-router-dom";

const Interview = () => {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const navigate = useNavigate();

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [questionTimer, setQuestionTimer] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  const QUESTION_DURATION = 120;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const VOICE_API = import.meta.env.VITE_VOICE_API;

  useEffect(() => {
    const resumeName = localStorage.getItem("interview-resume-name");
    const interviewType = localStorage.getItem("interview-type");
    const savedQuestions = localStorage.getItem("interviewQuestions");

    if (!resumeName || !interviewType || !savedQuestions) {
      navigate("/getstarted");
    } else {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, [navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        console.log("📦 Recorded Blob Size:", audioBlob.size, "bytes");
        console.log("🔗 Blob URL:", URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
        await sendAudioToBackend(audioBlob);
        setIsRecording(false);
      };
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera and microphone access denied or not available.");
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!mediaRecorderRef.current || isRecording) return;
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    console.log("🎙️ Recording started...");
    setIsRecording(true);
    setTranscript("");
    setEvaluation("");
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.stop();
    console.log("⏹️ Stopping recording...");
    setIsSendingAudio(true);
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "answer.webm");
    formData.append("question", currentQuestion || "No question"); // fallback

    try {
      console.log("📤 Sending audio to backend...");
      console.log("🧠 Question:", currentQuestion);
      const response = await fetch(`${VOICE_API}/api/voice/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setTranscript(data.user || "");
      setEvaluation(formatEvaluation(data));
      setExpectedAnswer(data.expected || "");

      setEvaluations((prev) => [
        ...prev,
        {
          question: currentQuestion,
          transcription: data.user || "",
          feedback: { gpt: data.feedback || "" },
          ...data.score,
        },
      ]);
    } catch (error) {
      console.error("❌ Error sending audio to backend:", error);
      setTranscript("Error processing audio.");
      setEvaluation("");
    } finally {
      setIsSendingAudio(false);
    }
  };

  const formatEvaluation = (data) => {
    if (!data || !data.feedback) return "No evaluation returned.";
    let scoreLines = "";
    if (data.score && typeof data.score === "object") {
      scoreLines = Object.entries(data.score)
        .map(([domain, score]) => `${domain.toUpperCase()}: ${score}/10`)
        .join("\n");
    }
    return `${scoreLines}\n\nFeedback: ${data.feedback}`;
  };

  const computeSummary = () => {
    const sum = (key) =>
      evaluations.reduce((acc, item) => acc + (item[key] || 0), 0) / (evaluations.length || 1);
    return {
      average_clarity_score: Math.round(sum("clarity_score") * 10) / 10,
      average_technical_score: Math.round(sum("technical_score") * 10) / 10,
      average_structure_score: Math.round(sum("structure_score") * 10) / 10,
      average_face_confidence: Math.round(sum("face_confidence") * 10) / 10,
    };
  };

  const handleNextQuestion = async () => {
    if (questionIndex + 1 < questions.length) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setQuestionTimer(QUESTION_DURATION);
      setTranscript("");
      setEvaluation("");
      setExpectedAnswer("");
    } else {
      try {
        const finalReport = {
          summary: computeSummary(),
          evaluations,
          overall_feedback: "Great job! Keep refining your communication.",
        };

        const res = await fetch(`${BACKEND_URL}/api/roadmap/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scores: finalReport.summary }),
        });

        const data = await res.json();
        finalReport.learning_path = data.roadmap || [];

        localStorage.setItem("interview-report", JSON.stringify(finalReport));
      } catch (err) {
        console.error("❌ Error fetching roadmap:", err);
      }

      setInterviewEnded(true);
      setIsInterviewStarted(false);
      stopCamera();
    }
  };

  const handleStartInterview = () => {
    if (questions.length === 0) {
      alert("No questions loaded.");
      return;
    }
    setIsInterviewStarted(true);
    setInterviewEnded(false);
    setQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setQuestionTimer(QUESTION_DURATION);
    setTranscript("");
    setEvaluation("");
    setExpectedAnswer("");
    setEvaluations([]);
  };

  const handleEndInterview = () => {
    setInterviewEnded(true);
    setIsInterviewStarted(false);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!isInterviewStarted || interviewEnded) return;
    const interval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return QUESTION_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isInterviewStarted, interviewEnded, questionIndex]);

  useEffect(() => {
    if (hasCameraPermission && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play();
    }
  }, [hasCameraPermission]);

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-900">
      <div className="relative z-10 bg-opacity-20 backdrop-blur-lg shadow-xl rounded-xl p-6 max-w-[900px] w-full flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-white mb-8">Interview</h2>

        <div className="w-full max-w-[900px] max-h-[550px] bg-black rounded-lg overflow-hidden mb-8 flex justify-center items-center">
          {hasCameraPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onError={() => console.log("Video playback error")}
              className="w-full h-full object-contain transform scale-x-[-1]"
            />
          ) : (
            <button
              onClick={startCamera}
              className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Allow Camera & Mic Access
            </button>
          )}
        </div>

        {isInterviewStarted && !interviewEnded && (
          <div className="text-white mb-8 max-w-[900px]">
            <p className="text-lg font-semibold mb-2">
              ⏱ Time Left: {Math.floor(questionTimer / 60)}:
              {String(questionTimer % 60).padStart(2, "0")}
            </p>
            <p className="text-xl font-semibold mt-4">{currentQuestion}</p>

            <div className="mt-4 p-4 bg-gray-800 rounded-md min-h-[80px] text-left">
              <p className="text-gray-300 font-semibold">Transcription:</p>
              <p className="text-gray-100">{transcript || "No answer recorded yet."}</p>
              {expectedAnswer && (
                <>
                  <p className="mt-3 text-gray-300 font-semibold">Expected Answer:</p>
                  <p className="text-gray-100">{expectedAnswer}</p>
                </>
              )}
              <p className="mt-3 text-gray-300 font-semibold">Evaluation:</p>
              <pre className="text-gray-100 whitespace-pre-wrap">
                {evaluation || (isSendingAudio ? "Uploading your answer..." : "No evaluation yet.")}
              </pre>
            </div>
          </div>
        )}

        <div className="flex gap-6 flex-wrap justify-center max-w-[900px]">
          {!isInterviewStarted && hasCameraPermission && !interviewEnded && (
            <button
              onClick={handleStartInterview}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Start Interview
            </button>
          )}

          {isInterviewStarted && !interviewEnded && (
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSendingAudio}
                className={`px-8 py-3 rounded-lg font-bold shadow-md transition ${
                  isRecording
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                } ${isSendingAudio ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={isRecording || isSendingAudio}
                className={`px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition ${
                  isRecording || isSendingAudio ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next Question
              </button>

              <button
                onClick={handleEndInterview}
                disabled={isRecording || isSendingAudio}
                className={`px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition ${
                  isRecording || isSendingAudio ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                End Interview
              </button>
            </>
          )}

          {interviewEnded && (
            <button
              onClick={() => navigate("/results")}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              View Results
            </button>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Interview;
