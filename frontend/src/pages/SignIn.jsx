import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/sign.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/authentication`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        navigate("/todos", { replace: true });
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        setEmail("");
        setPassword("");
        navigate("/todos", { replace: true });
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  if (loading) {
    return (
      <p style={{ color: "white", fontSize: "50px", fontFamily: "sans-serif" }}>
        Loading...
      </p>
    );
  }

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleSignIn}>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email Address"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="error">{error}</p>

        <button type="submit">Sign In</button>
        <p>
          Create New Account? <a href="/signup">Create</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
