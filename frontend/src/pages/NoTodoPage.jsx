import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../assets/todo.css";

const NoTodoPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/signout`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        window.location.href = "/signin";
      }
    } catch (err) {
      console.log("Error signing out", err);
    }
  };

  
  const changePass = () => {
    navigate("/change/password");
  };

  return (
    <div className={`todo-container ${sidebarOpen ? "sidebar-show" : ""}`}>
      <Sidebar />

      <div className="todo-bar no-todo-bar">
        <div className="noabove">
          <div>
            <button className="toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
          </div>
          <div className="sideButtons">
            <div className="focus-mode" onClick={handleLogout}>
              Logout
            </div>
            <div className="settings" onClick={changePass}>
              ⚙️
            </div>
          </div>
        </div>

        <div className="no-todo-content">
          <h2>TodoPie</h2>
        </div>
      </div>
    </div>
  );
};

export default NoTodoPage;