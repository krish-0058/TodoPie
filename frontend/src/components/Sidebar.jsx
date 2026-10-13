import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [allList, setAllList] = useState([]);
  const [sideList, setSideList] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/list`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAllList(data);
        } else {
          console.log("Failed to fetch list");
        }
      } catch (err) {
        console.log("Error fetching:", err);
      }
    };

    fetchList();
  }, []);

  const addList = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/list`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sideList,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setAllList([...allList, { sideList }]);
        setSideList("");
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log("Error occured ", err);
    }
  };

  const deleteList = async (deleteListName) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/deletelist`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deleteListName,
        }),
      });

      setAllList(allList.filter((item) => item.sideList !== deleteListName));
      window.location.href = "/todos";
    } catch (err) {
      console.log("Error while deleting");
    }
  };

  const goToLink = (linkName) => {
    navigate(`/todos/${linkName}`);
  };

  return (
    <div className="sidebar">
      <div className="list-title">
        <h1>LISTS</h1>
      </div>

      <div className="list-items">
        {allList.map((item, index) => (
          <div className="list-item" key={item._id || `${item.sideList}-${index}`}>
            <button className="delete-btn" onClick={() => deleteList(item.sideList)}>
              🗑️
            </button>

            <div className="these-two" onClick={() => goToLink(item.sideList)}>
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
          <button className="new-list-btn">+ New List</button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;