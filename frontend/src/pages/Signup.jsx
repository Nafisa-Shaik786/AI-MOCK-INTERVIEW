import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { heroBackground } from "../assets";
import Section from "../components/Section";
import { Rings } from "react-loader-spinner";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      username: formData.username,
      email: formData.email,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", "sample-token");
    localStorage.setItem("userId", "123456");
    navigate("/getstarted");
  };

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={heroBackground}
          alt="hero background"
          className="w-full object-cover blur-lg opacity-20"
          width={1440}
          height={1800}
        />
      </div>

      <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2
          className="text-3xl font-extrabold mb-6"
          style={{
            color: "#6B46C1",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Sign Up
        </h2>
        <p className="text-gray-700 mb-6">
          Create an account to start practicing your interviews with AI guidance.
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

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
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 underline hover:text-purple-800"
          >
            Log In
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <Rings height={50} width={50} color="#6B46C1" visible={false} />
      </div>
    </Section>
  );
};

export default Signup;
