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
  const [questionTimer, setQuestionTimer] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [isSendingAudio, setIsSendingAudio] = useState(false);

  const questions = [
    "Tell me about yourself.",
    "Why do you want this job?",
    "What are your strengths?",
    "Describe a challenge you faced and how you handled it.",
  ];

  const QUESTION_DURATION = 120;

  //  Redirect to /getstarted if info missing
  useEffect(() => {
    const resumeName = localStorage.getItem("interview-resume-name");
    const interviewType = localStorage.getItem("interview-type");

    if (!resumeName || !interviewType) {
      navigate("/getstarted");
    }
  }, [navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

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
    setIsRecording(true);
    setTranscript("");
    setEvaluation("");
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.stop();
    setIsSendingAudio(true);
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "answer.webm");

    try {
      const response = await fetch("https://your-backend-api/voice-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setTranscript(data.transcript || "");
      setEvaluation(data.evaluation || "");
    } catch (error) {
      setTranscript("Error processing audio.");
      setEvaluation("");
      console.error("Error sending audio to backend:", error);
    } finally {
      setIsSendingAudio(false);
    }
  };

  const handleStartInterview = () => {
    setIsInterviewStarted(true);
    setInterviewEnded(false);
    setQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setQuestionTimer(QUESTION_DURATION);
    setTranscript("");
    setEvaluation("");
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < questions.length) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setQuestionTimer(QUESTION_DURATION);
      setTranscript("");
      setEvaluation("");
    } else {
      setInterviewEnded(true);
      setIsInterviewStarted(false);
      stopCamera();
    }
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

            <div className="mt-4 p-4 bg-gray-800 rounded-md min-h-[80px]">
              <p className="text-gray-300 font-semibold">Transcription:</p>
              <p className="text-gray-100">{transcript || "No answer recorded yet."}</p>
              <p className="mt-3 text-gray-300 font-semibold">Evaluation:</p>
              <p className="text-gray-100">{evaluation || "No evaluation yet."}</p>
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
