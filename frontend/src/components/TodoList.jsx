import React, { useEffect, useState } from "react";
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

  const fetchTodo = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/todos/${params.todoId}`, {
        method: "GET",
        credentials: "include",
      });

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
  };

  useEffect(() => {
    fetchTodo();
  }, [params.todoId]);

  const addTodoList = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/todos/${params.todoId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo: todoList,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        fetchTodo();
        setTodoList("");
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log("Error occured ", err);
    }
  };

  const clearCookie = async () => {
    try {
        const res = await fetch(
      `${process.env.REACT_APP_API_URL}/signout`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (res.ok) {
      window.location.href = "/signin";
    } else {
      console.error("Logout failed:", res.status);
    }
    } catch (err) {
      console.log("Error");
    }
  };

  const handleCheckBox = (todo) => {
    if (selectedTodos.includes(todo)) {
      setSelectedTodos(selectedTodos.filter((t) => t !== todo));
    } else {
      setSelectedTodos([...selectedTodos, todo]);
    }
  };

  const submitTodo = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/todos/submit/${params.todoId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedTodos,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        fetchTodo();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log("Error occured ", err);
    }
  };

  const changePass = () => {
    navigate("/change/password");
  };

  if (loading || !validate) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "50px",
          fontFamily: "sans-serif",
        }}
      >
        Loading...
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
          <div className="focus-mode" onClick={clearCookie}>
            Logout
          </div>
          <div className="settings" onClick={changePass}>
            ⚙️
          </div>
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
          <button className="new-list-btn">+ Add Todo</button>
        </form>
      </div>

      <div className="all-todos">
        {allTodo.map((item, index) => (
          <div className="todo-item" key={item._id || `${item.todo}-${index}`}>
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

      {error ? <p className="error">{error}</p> : null}

      <div>
        <form onSubmit={submitTodo}>
          <button className="completed">Completed</button>
        </form>
      </div>
    </div>
  );
};

export default TodoList;
