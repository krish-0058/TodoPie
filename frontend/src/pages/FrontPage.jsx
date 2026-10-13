import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/front.css";

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div className="front-container">
      <div className="front-content">
        <h1 className="front-title">TodoPie</h1>
        <p className="front-description">
          Organize your daily tasks with ease and clarity. Stay focused,
          track your progress, and accomplish your goals one step at a time.
          TodoPie helps you plan smarter, stay productive, and bring balance
          to your day — simple, smart, and truly effective.
        </p>
      </div>

      <div className="front-buttons">
        <button onClick={() => navigate("/signin")} className="btn signin-btn">
          Sign In
        </button>
        <button onClick={() => navigate("/signup")} className="btn signup-btn">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default FrontPage;
