import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TodoList from "../components/TodoList";
import "../assets/todo.css";

const TodoPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`todo-container ${sidebarOpen ? "sidebar-show" : ""}`}>
      <Sidebar />
      <TodoList toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
};

export default TodoPage;
