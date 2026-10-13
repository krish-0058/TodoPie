import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import FrontPage from "./pages/FrontPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ChangePassword from "./pages/ChangePassword";
import TodoPage from "./pages/TodoPage";
import NoTodoPage from "./pages/NoTodoPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <NoTodoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/todos/:todoId"
        element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change/password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/todos" />} />
    </Routes>
  );
};

export default App;
