import React, { useEffect, useState } from "react";

const PastSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("⚠️ Missing login information. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/dsa-submissions?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server error: ${res.status} ${errorText}`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setSubmissions(data);
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError("❌ Failed to load submissions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const sortSubmissions = (subs, option) => {
    const sorted = [...subs];
    switch (option) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case "difficulty":
        const levels = { easy: 1, medium: 2, hard: 3 };
        return sorted.sort(
          (a, b) =>
            (levels[a.difficulty?.toLowerCase()] || 0) -
            (levels[b.difficulty?.toLowerCase()] || 0)
        );
      case "role":
        return sorted.sort((a, b) => a.role.localeCompare(b.role));
      default:
        return sorted;
    }
  };

  const displayedSubmissions = sortSubmissions(submissions, sortOption);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-purple-700">📝 Past Submissions</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-600">
              Sort By:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-1 rounded-md text-sm text-gray-800 bg-white shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="difficulty">Difficulty (Easy → Hard)</option>
              <option value="role">Role (A → Z)</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-gray-600">Loading submissions...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && displayedSubmissions.length === 0 && (
          <p className="text-gray-600">No submissions found yet.</p>
        )}

        {!loading && !error && displayedSubmissions.length > 0 && (
          <ul className="space-y-4">
            {displayedSubmissions.map((sub, index) => (
              <li key={index} className="border p-4 rounded-md bg-gray-100">
                <div className="text-sm text-gray-500 mb-1">
                  🕒 {new Date(sub.timestamp).toLocaleString()}
                </div>
                <div className="font-medium text-purple-700">
                  Role: {sub.role} | Difficulty: {sub.difficulty}
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Code:</p>
                  <pre className="bg-white p-3 rounded-md border mt-1 text-sm overflow-x-auto whitespace-pre-wrap">
                    {sub.code}
                  </pre>
                </div>
                <div className="mt-3">
                  <p className="font-semibold">Output:</p>
                  <pre className="bg-white p-2 rounded-md border text-sm text-gray-800 whitespace-pre-wrap">
                    {sub.result || "No output returned."}
                  </pre>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PastSubmissions;
