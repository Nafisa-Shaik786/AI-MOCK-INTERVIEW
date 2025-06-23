import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleAndDifficulty = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleStart = () => {
    if (!role || !difficulty) {
      alert("Please select both role and difficulty level.");
      return;
    }

    // Save choices to localStorage or pass via state
    localStorage.setItem("coding-role", role);
    localStorage.setItem("coding-difficulty", difficulty);

    navigate("/codeeditor");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Select Role & Difficulty</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Role</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="datascience">Data Scientist</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
        >
          Start Coding Interview
        </button>
      </div>
    </div>
  );
};

export default RoleAndDifficulty;
