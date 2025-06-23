import React, { useEffect, useState } from "react";
import Section from "../components/Section";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("https://mockai-mqnl.onrender.com/interview-report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };
    fetchReport();
  }, []);

  if (!report)
    return (
      <Section className="min-h-screen flex flex-col items-center justify-center text-white p-8 text-center">
        <Rings />
        <p className="mt-4 text-lg font-semibold">Analyzing your responses, please wait...</p>
      </Section>
    );

  const { summary, evaluations, overall_feedback } = report;

  const data = {
    labels: ["Clarity", "Technical", "Structure", "Face Confidence"],
    datasets: [
      {
        label: "Average Score",
        data: [
          summary?.average_clarity_score || 0,
          summary?.average_technical_score || 0,
          summary?.average_structure_score || 0,
          summary?.average_face_confidence || 0,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#e91e63"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 5.5,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 1, color: "white", font: { size: 20 } },
      },
      x: {
        ticks: { color: "white", font: { size: 16 } },
      },
    },
    plugins: {
      legend: { labels: { color: "white", font: { size: 20 } } },
      title: {
        display: true,
        text: "Interview Evaluation Scores",
        color: "white",
        font: { size: 25 },
      },
      tooltip: {
        enabled: true,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
      },
    },
  };

  return (
    <Section className="min-h-screen p-8 text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center">Interview Results</h2>

      <div className="bg-white bg-opacity-10 rounded-lg p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Overall AI Feedback</h3>
        <p className="mb-6 text-lg">{overall_feedback}</p>

        <Bar data={data} options={options} />

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Detailed Evaluations</h3>
          {evaluations.map((evalItem, idx) => (
            <div
              key={idx}
              className="mb-6 p-4 border border-gray-300 rounded-lg bg-white bg-opacity-5"
            >
              <p className="text-md mb-3">
                <strong>Question:</strong> {evalItem.question}
              </p>
              <p className="text-md mb-3">
                <strong>Answer:</strong> {evalItem.transcription}
              </p>
              <div className="text-sm mb-2">
                <p>Clarity Score: {evalItem.clarity_score}</p>
                <p>Technical Score: {evalItem.technical_score}</p>
                <p>Structure Score: {evalItem.structure_score}</p>
                <p>Answer Score: {evalItem.answer_score}</p>
                <p>Face Confidence: {evalItem.face_confidence}</p>
              </div>
              {evalItem.mispronounced_words?.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold text-red-300">Mispronounced Words:</p>
                  <ul className="list-disc list-inside text-red-400">
                    {evalItem.mispronounced_words.map((word, idx2) => (
                      <li key={idx2}>{word}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <p className="font-semibold text-green-300">Feedback:</p>
                <p className="text-sm mb-2">{evalItem.feedback.gpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-10 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
      >
        Back to Home
      </button>
    </Section>
  );
};

export default Results;
