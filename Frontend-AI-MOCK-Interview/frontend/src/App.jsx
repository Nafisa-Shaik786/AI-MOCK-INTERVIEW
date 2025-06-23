import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

// General Pages
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ResumeUploader from "./pages/ResumeUploader";
import Interview from "./pages/Interview";
import Results from "./pages/Results";

// DSA Practice Pages
import DSADashboard from "./pages/DSADashboard";
import CodeEditorPage from "./pages/CodeEditorPage";
import DSAResult from "./pages/DSAResult";

// History Page
import InterviewHistory from "./pages/InterviewHistory";

// DSA access control
import RequireDSASelection from "./pages/RequireDSASelection";

// Past Submissions Page
import PastSubmissions from "./pages/PastSubmissions";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center text-center p-8">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/getstarted" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resumeuploader" element={<ResumeUploader />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/results" element={<Results />} />

          {/* DSA Practice */}
          <Route path="/dsadashboard" element={<DSADashboard />} />
          <Route
            path="/code-editor"
            element={
              <RequireDSASelection>
                <CodeEditorPage />
              </RequireDSASelection>
            }
          />
          <Route path="/dsaresult" element={<DSAResult />} />

          {/* Interview History */}
          <Route path="/interview-history" element={<InterviewHistory />} />
          <Route path="/past-submissions" element={<PastSubmissions />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
