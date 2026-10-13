import React, { useState } from "react";
import "../assets/sign.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  

  const handleUserData = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setEmail("");
        setPassword("");
        window.location.href = "/todos";
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.log("Error occurred:", err);
      setError("Unable to connect to the server");
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

        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <a href="/signin">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
