// src/components/TodoList.js
import React, { Component } from 'react';
import TodoItem from './TodoItem';
import '../styles/style.css'; // Import the TodoList styles
const API_URL = process.env.REACT_APP_API_URL;

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      title: '',
      status: 'pending',
      editingId: null,
      error: '', // Added error state
    };
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ todos: data });
      })
      .catch((error) => console.error('Error:', error));
  };

  handleAddTodo = () => {
    const { title, status } = this.state; // Capture status
    const token = localStorage.getItem('token');

    // Check if title is empty
    if (!title.trim()) {
      this.setState({ error: 'Title field is required.' }); // Set error message
      return; // Exit the function if title is empty
    }

    fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, status }) // Include status in the request body
    })
      .then(() => {
        this.fetchTodos();
        this.setState({ title: '', status: 'pending', error: '' }); // Clear error on success
      })
      .catch((error) => console.error('Error:', error));
  };

  handleDeleteTodo = (id) => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => this.fetchTodos())
      .catch((error) => console.error('Error:', error));
  };

  handleEditTodo = (todo) => {
    this.setState({ title: todo.title, status: todo.status, editingId: todo.id });
  };

  handleUpdateTodo = () => {
    const { title, status, editingId } = this.state; // Include status
    const token = localStorage.getItem('token');

    // Check if title is empty
    if (!title.trim()) {
      this.setState({ error: 'Title field is required.' }); // Set error message
      return; // Exit the function if title is empty
    }

    fetch(`${API_URL}/api/todos/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, status }) // Include status in the request body
    })
      .then(() => {
        this.fetchTodos();
        this.setState({ title: '', status: 'pending', editingId: null, error: '' }); // Clear error on success
      })
      .catch((error) => console.error('Error:', error));
  };

  render() {
    const { todos, title, status, editingId, error } = this.state;
    return (
      <div>
        <h2>Todo List</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => this.setState({ title: e.target.value, error: '' })} // Clear error on input change
          placeholder="New Todo"
        />
        <select value={status} onChange={(e) => this.setState({ status: e.target.value })}>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="done">Done</option>
        </select>
        {editingId ? (
          <button onClick={this.handleUpdateTodo}>Update Todo</button>
        ) : (
          <button onClick={this.handleAddTodo}>Add Todo</button>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem 
                todo={todo} 
                token={localStorage.getItem('token')} // Pass token to TodoItem
                fetchTodos={this.fetchTodos} // Pass fetchTodos function
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TodoList;
