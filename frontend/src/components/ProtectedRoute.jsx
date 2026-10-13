
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/authentication`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAuthenticated(res.ok);
      } catch (err) {
        console.error("Authentication check failed:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <p style={{ color: "white", fontSize: "50px", fontFamily: "sans-serif" }}>
        Loading...
      </p>
    );
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
