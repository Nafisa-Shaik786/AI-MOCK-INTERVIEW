import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Section from "../components/Section";
import { heroBackground } from "../assets";
import { Rings } from "react-loader-spinner";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-between p-8 bg-gray-50 text-center">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={heroBackground}
          alt="hero background"
          className="w-full h-full object-cover blur-lg opacity-20"
          width={1440}
          height={1800}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full">
        <h1
          className="text-5xl font-extrabold mb-6"
          style={{
            color: "#6B46C1",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {user ? `Welcome back, ${user.username}!` : "Welcome to MockAI"}
        </h1>

        <p className="text-lg mb-10 text-gray-700">
          {user
            ? "Ready to sharpen your interview skills with personalized AI guidance?"
            : "Prepare for your dream job with AI-powered mock interviews and expert feedback."}
        </p>

        <button
          onClick={() => navigate(user ? "/getstarted" : "/signup")}
          className="px-10 py-4 bg-purple-600 text-white font-bold rounded-md shadow-md hover:bg-purple-700 transition transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Bottom Info Sections */}
      <div className="relative z-10 max-w-5xl w-full mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-700">Personalized Questions</h3>
          <p className="text-gray-600">
            Receive interview questions tailored to your resume and job description.
          </p>
        </div>

        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-700">Real-Time Feedback</h3>
          <p className="text-gray-600">
            Get instant AI feedback on your answers, helping you improve quickly.
          </p>
        </div>

        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-700">Performance Tracking</h3>
          <p className="text-gray-600">
            Monitor your progress and get actionable tips to ace your interviews.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-16 mb-6 text-gray-600 text-sm">
        © 2025 MockAI. All rights reserved.
      </div>

      {/* Decorative Loader */}
      <div className="relative z-10">
        <Rings height={50} width={50} color="#6B46C1" visible={false} ariaLabel="loading" />
      </div>
    </Section>
  );
};

export default HomePage;
