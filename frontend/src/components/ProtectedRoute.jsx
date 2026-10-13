import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
       const res = await fetch(
        `${process.env.REACT_APP}/authentication`,
        {
          method: "GET",
          credentials: "include",
        }
      );

        setAuthenticated(res.status === 200);
      } catch (err) {
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