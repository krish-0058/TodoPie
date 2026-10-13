
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../assets/todo.css";

const NoTodoPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
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
            <button
              className="toggle"
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              ☰
            </button>
          </div>

          <div className="sideButtons">
            <button
              type="button"
              className="focus-mode"
              onClick={handleLogout}
            >
              Logout
            </button>

            <button
              type="button"
              className="settings"
              onClick={changePass}
            >
              ⚙️
            </button>
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
