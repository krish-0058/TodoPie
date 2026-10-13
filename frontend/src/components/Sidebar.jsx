
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [allList, setAllList] = useState([]);
  const [sideList, setSideList] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/list`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch lists.");
        }

        const data = await res.json();
        setAllList(data);
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    };

    fetchList();
  }, [navigate]);

  const addList = async (e) => {
    e.preventDefault();
    setError("");

    if (!sideList.trim()) {
      setError("Please enter a list name.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/list`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sideList: sideList.trim(),
          }),
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
        return;
      }

      if (res.ok) {
        // Refetch to get the MongoDB _id as well.
        const listRes = await fetch(
          `${process.env.REACT_APP_API_URL}/list`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (listRes.ok) {
          setAllList(await listRes.json());
        }

        setSideList("");
        setError("");
      } else {
        setError(data.message || "Failed to create list.");
      }
    } catch (err) {
      console.error("Error creating list:", err);
      setError("Unable to connect to the server.");
    }
  };

  const deleteList = async (deleteListName) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/deletelist`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deleteListName }),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to delete list.");
        return;
      }

      setAllList((prev) =>
        prev.filter((item) => item.sideList !== deleteListName)
      );

      navigate("/todos");
    } catch (err) {
      console.error("Error deleting list:", err);
      setError("Unable to delete list.");
    }
  };

  const goToLink = (linkName) => {
    navigate(`/todos/${encodeURIComponent(linkName)}`);
  };

  return (
    <div className="sidebar">
      <div className="list-title">
        <h1>LISTS</h1>
      </div>

      <div className="list-items">
        {allList.map((item, index) => (
          <div
            className="list-item"
            key={item._id || `${item.sideList}-${index}`}
          >
            <button
              className="delete-btn"
              type="button"
              onClick={() => deleteList(item.sideList)}
            >
              🗑️
            </button>

            <div
              className="these-two"
              onClick={() => goToLink(item.sideList)}
            >
              {item.sideList}
            </div>
          </div>
        ))}
      </div>

      <div className="add-todo">
        <p className="error">{error}</p>

        <form onSubmit={addList}>
          <input
            type="text"
            placeholder="Add todo..."
            value={sideList}
            onChange={(e) => setSideList(e.target.value)}
          />

          <button className="new-list-btn" type="submit">
            + New List
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
