import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Clear session/local storage if used
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: "absolute",
        right: "20px",
        top: "20px",
        background: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;