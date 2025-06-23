import { useState, useEffect } from "react";
import { heroBackground } from "../assets";
import Section from "../components/Section";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      if (!storedUser.username) {
        const name = prompt("Enter your name:");
        if (name) {
          const updatedUser = { ...storedUser, username: name };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      }
    } else {
      navigate("/login");
    }

    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setCameraAllowed(true);
      } catch (err) {
        setCameraAllowed(false);
        alert("Camera access denied. Please allow camera access to proceed.");
      }
    };

    enableCamera();
  }, [navigate]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    alert("✅ Profile updated successfully!");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowModal(false);
    alert("✅ Password updated successfully!");
  };

  const handleExit = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-900">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] left-1/2 w-[200%] -translate-x-1/2">
          <img
            src={heroBackground}
            alt="hero background"
            className="w-full object-cover blur-lg"
          />
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-4xl font-extrabold text-purple-800 mb-2">
          Welcome, {user.username || "User"}!
        </h2>
        <p className="mb-6 text-purple-600">
          You're logged in as <span className="font-semibold text-purple-600">{user.email}</span>
        </p>

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-purple-700 font-semibold mb-1">Username:</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full p-3 border border-purple-600 rounded-lg bg-white text-black"
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-purple-700 font-semibold mb-1">Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-3 border border-purple-600 rounded-lg bg-white text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-700 transition"
          >
            Update Profile
          </button>
        </form>

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 mt-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-700 transition"
        >
          Reset Password
        </button>

        <button
          onClick={handleExit}
          className="w-full mt-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          Exit
        </button>

        <button
          onClick={handleSignOut}
          className="w-full mt-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-purple-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Old Password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full p-3 border border-purple-600 rounded-lg bg-purple-800 text-purple-200"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full p-3 border border-purple-600 rounded-lg bg-purple-800 text-purple-200"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
                className="w-full p-3 border border-purple-600 rounded-lg bg-purple-800 text-purple-200"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="px-6 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Section>
  );
};

export default Profile;
