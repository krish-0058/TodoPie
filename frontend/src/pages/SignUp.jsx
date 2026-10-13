
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/sign.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUserData = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setEmail("");
        setPassword("");
        navigate("/signin", { replace: true });
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleUserData}>
        <h2>Create Account</h2>

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <p className="error">{error}</p>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating Account..." : "Sign Up"}
        </button>

        <p>
          Already have an account? <a href="/signin">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
