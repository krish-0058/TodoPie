
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TodoList = ({ toggleSidebar }) => {
  const [todoList, setTodoList] = useState("");
  const [allTodo, setAllTodo] = useState([]);
  const [error, setError] = useState("");
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validate, setValidate] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const fetchTodo = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP}/todos/${params.todoId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        setValidate(true);
        setAllTodo(data);
      } else if (res.status === 404) {
        window.location.href = data.redirect;
      } else {
        console.log("Failed to fetch list");
      }
    } catch (err) {
      console.log("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [params.todoId]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  const addTodoList = async (e) => {
    e.preventDefault();

    if (!todoList.trim()) {
      setError("Please enter a todo.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP}/todos/${params.todoId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo: todoList }),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        await fetchTodo();
        setTodoList("");
        setError("");
      } else {
        setError(data.message || "Failed to add todo.");
      }
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const clearCookie = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP}/signout`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        navigate("/signin");
      } else {
        console.error("Logout failed:", res.status);
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleCheckBox = (todo) => {
    setSelectedTodos((prevSelected) =>
      prevSelected.includes(todo)
        ? prevSelected.filter((item) => item !== todo)
        : [...prevSelected, todo]
    );
  };

  const submitTodo = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP}/todos/submit/${params.todoId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedTodos }),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        setSelectedTodos([]);
        await fetchTodo();
        setError("");
      } else {
        setError(data.message || "Failed to complete todos.");
      }
    } catch (err) {
      console.error("Error submitting todos:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const changePass = () => {
    navigate("/change/password");
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "30px",
          fontFamily: "sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!validate) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        Unable to load this todo list.
      </div>
    );
  }

  return (
    <div className="todo-bar">
      <div className="above">
        <div>
          <button className="toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <div className="sideButtons">
          <button
            type="button"
            className="focus-mode"
            onClick={clearCookie}
          >
            Logout
          </button>

          <button
            type="button"
            className="settings"
            onClick={changePass}
          >
            ⚙️
          </button>
        </div>
      </div>

      <h2>{params.todoId}</h2>

      <div className="add-new-todo">
        <form onSubmit={addTodoList}>
          <input
            type="text"
            placeholder="What needs to get done?"
            value={todoList}
            onChange={(e) => setTodoList(e.target.value)}
          />

          <button type="submit" className="new-list-btn">
            + Add Todo
          </button>
        </form>
      </div>

      <div className="all-todos">
        {allTodo.map((item, index) => (
          <div
            className="todo-item"
            key={item._id || `${item.todo}-${index}`}
          >
            <label>
              <input
                type="checkbox"
                checked={selectedTodos.includes(item.todo)}
                onChange={() => handleCheckBox(item.todo)}
              />

              <span>{item.todo}</span>
            </label>
          </div>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div>
        <form onSubmit={submitTodo}>
          <button type="submit" className="completed">
            Completed
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoList;
