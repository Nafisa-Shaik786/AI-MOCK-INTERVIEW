import React, { useEffect, useState } from "react";

const DSAResult = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("dsa-history");
    if (stored) {
      setInterviews(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-xl rounded-xl">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
          Past Interview Records
        </h1>

        {interviews.length === 0 ? (
          <p className="text-gray-600 text-center">No past interviews found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviews.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
                      {item.difficulty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">
                      {item.score || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => alert("Feature coming soon")}
                        className="text-purple-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSAResult;
