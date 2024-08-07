import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Todo.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || "User");
        fetchTodos(user);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchTodos = async (user) => {
    const q = query(collection(db, "todos"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    setTodos(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        userId: auth.currentUser.uid,
      });
      setNewTodo("");
      fetchTodos(auth.currentUser); // Refetch todos
    }
  };

  const handleEditTodo = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (auth.currentUser && editTodoId) {
      const todoRef = doc(db, "todos", editTodoId);
      await updateDoc(todoRef, {
        text: editTodoText,
      });
      setEditTodoId(null);
      setEditTodoText("");
      fetchTodos(auth.currentUser); // Refetch todos
    }
  };

  const handleDeleteTodo = async (id) => {
    if (auth.currentUser) {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
      fetchTodos(auth.currentUser); // Refetch todos
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="todo-page">
      <h1>WELCOME TO YOUR DAILY TO-DO PAGE, {username.toUpperCase()}</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="todo-container">
        <h2 className="todo-heading">Your To-Do</h2>
        <form
          onSubmit={editTodoId ? handleUpdateTodo : handleAddTodo}
          className="todo-form">
          <input
            placeholder="What're your plans today?  "
            type="text"
            value={editTodoId ? editTodoText : newTodo}
            onChange={(e) =>
              editTodoId
                ? setEditTodoText(e.target.value)
                : setNewTodo(e.target.value)
            }
            required
          />
          <button type="submit">
            {editTodoId ? "Update Todo" : "Add Todo"}
          </button>
        </form>
        <h2>To-Do List</h2>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span>{todo.text}</span>
              <div className="todo-item-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEditTodo(todo.id, todo.text)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
