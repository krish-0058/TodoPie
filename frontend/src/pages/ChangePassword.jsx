import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/sign.css";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin", { replace: true });
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/change/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
        return;
      }

      if (res.ok) {
        localStorage.removeItem("token");
        setPassword("");
        navigate("/signin", { replace: true });
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleChange}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="New Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <p className="error">{error}</p>

        <button type="submit" disabled={submitting}>
          {submitting ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
