import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireDSASelection = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("dsa-role");
    const difficulty = localStorage.getItem("dsa-difficulty");

    if (!role || !difficulty) {
      alert("Please select a role and difficulty first.");
      navigate("/dsadashboard");
    }
  }, [navigate]);

  return children;
};

export default RequireDSASelection;
