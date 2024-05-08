import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining.jsx";
import TodoFilter from "./components/TodoFilter.jsx";
import ClearCompleteBtn from "./components/ClearCompleteBtn.jsx";
import { useCallback, useEffect, useState } from "react";

function App() {
  let [todos, setTodos] = useState([]);

  let [filterTodos, setFilterTodos] = useState(todos);

  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        setFilterTodos(todos);
      });
  }, []);

  let filterBy = useCallback(
    (filter) => {
      if (filter === "All") {
        setFilterTodos(todos);
      }
      if (filter === "Active") {
        setFilterTodos(todos.filter((t) => !t.completed));
      }
      if (filter === "Completed") {
        setFilterTodos(todos.filter((t) => t.completed));
      }
    },
    [todos]
  );

  let addTodo = (todo) => {
    //update data at server side
    fetch("http://localhost:4000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    //update data at client side
    setTodos((prevState) => [...prevState, todo]);
  };

  let deleteTodo = (todoId) => {
    //server
    fetch(`http://localhost:4000/todos/${todoId}`, {
      method: "DELETE",
    });
    //Client
    setTodos((prevState) => {
      return prevState.filter((todo) => {
        return todo.id !== todoId;
      });
    });
  };

  let updateTodo = (todo) => {
    //server
    fetch(`http://localhost:4000/todos/${todo.id}`, {
      method: "PATCH",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    //client
    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id === todo.id) {
          return todo;
        }
        return t;
      });
    });
  };

  let remainingCount = todos.filter((t) => !t.completed).length;

  let checkAll = () => {
    //server
    todos.forEach((t) => {
      t.completed = true;
      updateTodo(t);
    });
    //client
    setTodos((prevState) => {
      return prevState.map((t) => {
        return { ...t, completed: true };
      });
    });
  };

  let clearCompleted = () => {
    //server
    todos.forEach((t) => {
      if (t.completed) {
        console.log(t.id);
        deleteTodo(t.id);
      }
    });
    //client
    setTodos((prevState) => {
      return prevState.filter((t) => !t.completed);
    });
  };

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filterTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
        <CheckAllAndRemaining
          remainingCount={remainingCount}
          checkAll={checkAll}
        />
        <div className="other-buttons-container">
          <TodoFilter filterBy={filterBy} />
          <ClearCompleteBtn clearCompleted={clearCompleted} />
        </div>
      </div>
    </div>
  );
}

export default App;
