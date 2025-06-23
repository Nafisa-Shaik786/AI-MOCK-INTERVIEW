import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [interviewType, setInterviewType] = useState("");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/signup");

      return;
    }

    // Optional camera pre-check
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setCameraError("");
      })
      .catch((err) => {
        console.error("Camera permission denied or unavailable", err);
        setCameraError("Camera access denied. Please allow it for the interview.");
      });
  }, [navigate]);

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleStartInterview = () => {
    if (!resumeFile) {
      alert("Please upload your resume file.");
      return;
    }

    if (!interviewType) {
      alert("Please select the type of interview.");
      return;
    }

    localStorage.setItem("interview-resume-name", resumeFile.name);
    localStorage.setItem("interview-type", interviewType);
    localStorage.setItem("interview-question-count", 5);
    localStorage.setItem("interview-attempted", 0);
    localStorage.setItem("interview-timer", 8 * 4 * 60); // 32 mins
    localStorage.setItem("interview-started", "false");

    if (interviewType === "managerial") {
      navigate("/interview");
    } else if (interviewType === "coding") {
      navigate("/dsadashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">Get Started</h2>

        {cameraError && (
          <div className="mb-4 text-sm text-red-600 font-medium text-center">
            {cameraError}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4 text-center">
          Please allow camera access when prompted. This is needed during the mock interview.
        </p>

        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Upload Your Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Select the type of interview you want
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled>
                -- Choose an option --
              </option>
              <option value="managerial">Managerial Interview</option>
              <option value="coding">Coding Interview</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleStartInterview}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetStarted;
