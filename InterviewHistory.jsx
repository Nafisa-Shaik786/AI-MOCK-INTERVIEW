import React, { useEffect, useState } from "react";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setError("Missing authentication. Please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/interview-history?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch interview history");

        const data = await res.json();
        setInterviews(data.reverse());
      } catch (err) {
        console.error(err);
        setError("Error fetching interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Past Interviews</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : interviews.length === 0 ? (
          <p className="text-gray-600">No interviews found.</p>
        ) : (
          <ul className="space-y-4">
            {interviews.map((interview, index) => (
              <li key={index} className="border p-4 rounded-md bg-gray-100">
                <p className="text-sm text-gray-500">🕒 {new Date(interview.timestamp).toLocaleString()}</p>
                <p className="font-semibold text-purple-700">Role: {interview.role}</p>
                <p className="font-semibold text-purple-700">Job Title: {interview.jobTitle}</p>
                <p className="mt-2">Score: {interview.score}/100</p>
                <p className="mt-1">Feedback: {interview.feedback}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
