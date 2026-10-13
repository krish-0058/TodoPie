import React, { useState } from "react";
import "../assets/sign.css";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP}/change/password`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        setPassword("");
        window.location.href = "/signin";
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log("Error occured ", err);
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleChange}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="error">{error}</p>

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;