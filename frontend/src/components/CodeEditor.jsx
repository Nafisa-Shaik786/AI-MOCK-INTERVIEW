import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CodeEditor = () => {
  const [code, setCode] = useState("// write your code here");
  const navigate = useNavigate();

  const handleRun = async () => {
    try {
      const response = await axios.post("http://localhost:5000/evaluate", {
        language: "cpp",
        code: code,
      });

      console.log(response.data);
      navigate("/dsaresult");
    } catch (error) {
      console.error("Error evaluating code:", error);
    }
  };

  return (
    <div>
      <Editor
        height="500px"
        defaultLanguage="cpp"
        defaultValue={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleRun}
      >
        Submit Code
      </button>
    </div>
  );
};

export default CodeEditor;
