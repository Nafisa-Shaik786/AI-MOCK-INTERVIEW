import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { heroBackground } from "../assets";
import Section from "../components/Section";
import { Rings } from "react-loader-spinner";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // State variables for each step
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  /**
   * Step 1: Send OTP to entered email
   */
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("OTP sent to:", email);
    setStep(2);
  };

  /**
   * Step 2: Verify OTP
   */
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    console.log("OTP entered:", otp);
    setStep(3);
  };

  /**
   * Step 3: Submit new password
   */
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    console.log("Password updated successfully");
    navigate("/login"); // Redirect to login after success
  };

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={heroBackground}
          alt="hero background"
          className="w-full object-cover blur-lg"
          width={1440}
          height={1800}
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-4xl font-extrabold text-white mb-6">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 text-center mb-5">{error}</p>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition transform hover:scale-105"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition transform hover:scale-105"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition transform hover:scale-105"
            >
              Update Password
            </button>
          </form>
        )}

        {/* Navigation to login */}
        <p className="text-white mt-8">
          <button
            onClick={() => navigate("/login")}
            className="text-purple-300 underline"
          >
            Back to Login
          </button>
        </p>
      </div>

      {/* Decorative background element */}
      <Rings />
    </Section>
  );
};

export default ForgotPassword;
