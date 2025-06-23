import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import Section from "../components/Section";
import { heroBackground } from "../assets";

const ResumeUploader = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleResumeChange = (e) => setResume(e.target.files[0]);

  const resetForm = () => {
    setIsUploaded(false);
    setIsAnalyzing(false);
    setResume(null);
    setJobDescription("");
    setNumQuestions("");
  };

  const canSubmit =
    resume !== null &&
    jobDescription.trim() !== "" &&
    Number.isInteger(numQuestions) &&
    numQuestions >= 1 &&
    numQuestions <= 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      alert("Please fill all fields correctly.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);
      formData.append("numQuestions", numQuestions);

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();

      if (data.questions && Array.isArray(data.questions)) {
        localStorage.setItem("interviewQuestions", JSON.stringify(data.questions));
        setIsUploaded(true);
      } else {
        alert("No questions received from API.");
      }
    } catch (error) {
      alert("Error generating questions: " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartInterview = () => {
    navigate("/interview");
  };

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] left-1/2 w-[200%] -translate-x-1/2 md:-top-[40%] md:w-[130%] lg:-top-[80%]">
          <img
            src={heroBackground}
            alt="hero background"
            className="w-full object-cover blur-lg opacity-20"
            width={1440}
            height={1800}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2
          className="text-4xl font-extrabold mb-8"
          style={{
            color: "#0A66C2",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontWeight: 700,
          }}
        >
          Upload Your Resume
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div>
            <label
              htmlFor="resume"
              className="block mb-2 text-lg font-semibold text-blue-800"
            >
              Resume:
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="w-full text-black text-lg p-4 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              required
            />
            {resume && (
              <p className="mt-1 text-sm text-gray-600">Selected file: {resume.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="jobDescription"
              className="block mb-2 text-lg font-semibold text-blue-800"
            >
              Job Description:
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              className="w-full text-black text-lg p-4 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter the job description..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="numQuestions"
              className="block mb-2 text-lg font-semibold text-blue-800"
            >
              Number of Questions:
            </label>
            <input
              id="numQuestions"
              type="number"
              min={1}
              max={100}
              value={numQuestions}
              onChange={(e) => {
                const val = e.target.value;
                setNumQuestions(val === "" ? "" : parseInt(val, 10));
              }}
              className="w-full text-black text-lg p-4 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of questions (1-100)"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !canSubmit}
            className={`w-full py-4 text-lg font-bold rounded-md shadow-md transition transform ${
              isAnalyzing || !canSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {isAnalyzing ? "Analyzing Resume..." : "Submit Resume"}
          </button>
        </form>
      </div>

      {(isAnalyzing || isUploaded) && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full text-left animate-fadeIn">
            <h3 className="text-2xl font-bold text-blue-800 mb-5">Interview Instructions</h3>
            <ul className="list-disc list-inside text-gray-800 space-y-2 text-base">
              <li>
                You will be asked <strong>{numQuestions} interview question{numQuestions > 1 ? "s" : ""}</strong>.
              </li>
              <li>Total interview time is <strong>{numQuestions * 4} minutes</strong>.</li>
              <li>
                After each question is spoken, click <strong>"Start Recording"</strong> to record your answer.
              </li>
              <li>
                Click <strong>"Stop Recording"</strong> to stop and automatically submit your response.
              </li>
              <li>
                Click <strong>"Next Question"</strong> after recording each answer to proceed.
              </li>
              <li>All answers will be recorded for analysis.</li>
              <li>
                You may end the interview early, but evaluation will be based only on attempted answers.
              </li>
              <li>Keep your face centered and speak clearly for best results.</li>
              <li>Make sure your camera and microphone are working properly.</li>
            </ul>
            <p className="mt-5 font-bold text-red-700 text-sm">
              ⚠️ It is mandatory to record an answer for each question. Unrecorded responses will not be evaluated.
            </p>
            <p className="mt-6 text-sm text-gray-600">
              Don’t worry — this is for practice and growth. Just do your best! 😊
            </p>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-400 text-white rounded-md font-semibold hover:bg-gray-500 transition"
              >
                Exit
              </button>

              {isUploaded ? (
                <button
                  onClick={handleStartInterview}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Start Your Interview
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded-md font-semibold cursor-not-allowed"
                >
                  Analyzing Resume...
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Rings
          height="60"
          width="60"
          color="#2563EB"
          radius="6"
          visible={isAnalyzing}
          ariaLabel="rings-loading"
        />
      </div>
    </Section>
  );
};

export default ResumeUploader;
