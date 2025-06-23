import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { heroBackground } from "../assets";
import Section from "../components/Section";
import { Rings } from "react-loader-spinner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated login (replace with real auth logic)
    const userData = {
      username: "User",
      email: formData.email,
    };

    // ✅ Store user details for global access
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", "demo-user-id");
    localStorage.setItem("token", "demo-token");

    navigate("/getstarted"); // Go to GetStarted after login
  };

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={heroBackground}
          alt="hero background"
          className="w-full object-cover blur-lg opacity-20"
          width={1440}
          height={1800}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2
          className="text-3xl font-extrabold mb-6"
          style={{
            color: "#6B46C1",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Log In
        </h2>
        <p className="text-gray-700 mb-6">
          Welcome back! Continue sharpening your interview skills with AI-driven insights.
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-md shadow-md hover:bg-purple-700 transition transform hover:scale-105"
          >
            Log In
          </button>
        </form>

        <p className="mt-8 text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 underline hover:text-purple-800">
            Sign Up
          </Link>
        </p>

        <p className="mt-5 text-gray-700">
          <Link to="/forgotpassword" className="text-purple-600 underline hover:text-purple-800">
            Forgot Password?
          </Link>
        </p>
      </div>

      {/* Optional Loader */}
      <div className="mt-8">
        <Rings height={50} width={50} color="#6B46C1" visible={false} ariaLabel="loading" />
      </div>
    </Section>
  );
};

export default Login;
