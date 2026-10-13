
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/sign.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setEmail("");
        setPassword("");
        navigate("/todos", { replace: true });
      } else {
        setError(data.message || "Sign in failed.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleSignIn}>
        <h2>Sign In</h2>

        <input
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="error">{error}</p>

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing In..." : "Sign In"}
        </button>

        <p>
          Create New Account? <a href="/signup">Create</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
