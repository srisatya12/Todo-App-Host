// src/components/TodoItem.js
import React from 'react';
import '../styles/style.css' // Import the TodoItem styles
const API_URL = process.env.REACT_APP_API_URL;

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            title: this.props.todo.title,
            status: this.props.todo.status,
        };
    }

    handleUpdate = () => {
        const { title, status } = this.state;

        fetch(`${API_URL}/api/todos/${this.props.todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.token}`
            },
            body: JSON.stringify({ title, status }), // Ensure status is included
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update todo.');
            }
            return response.json();
        })
        .then(() => {
            this.props.fetchTodos(); // Refresh the todo list
            this.setState({ isEditing: false }); // Exit edit mode
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    handleDelete = () => {
        fetch(`${API_URL}/api/todos/${this.props.todo.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete todo.');
            }
            return response.json();
        })
        .then(() => {
            this.props.fetchTodos(); // Refresh the todo list
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    handleEditToggle = () => {
        this.setState(prevState => ({
            isEditing: !prevState.isEditing,
            title: this.props.todo.title, // Reset title when editing is toggled
            status: this.props.todo.status, // Reset status when editing is toggled
        }));
    };

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    };

    handleStatusChange = (e) => {
        this.setState({ status: e.target.value }); // Handle status change
    };

    render() {
        const { todo } = this.props;
        const { isEditing, title, status } = this.state;

        return (
            <li style={{ marginBottom: '10px', listStyleType: 'none' }}>
                {isEditing ? (
                    <div>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={this.handleTitleChange} 
                        />
                        <select value={status} onChange={this.handleStatusChange}>
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="done">Done</option> {/* Added Incompleted */}
                        </select>
                        <button onClick={this.handleUpdate}>Save</button>
                        <button onClick={this.handleEditToggle}>Cancel</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{todo.title} - {todo.status}</span>
                        <button onClick={this.handleEditToggle}>Edit</button>
                        <button style={{ backgroundColor: 'red',color:'white' }} onClick={this.handleDelete}>Delete</button>
                    </div>
                )}
            </li>
        );
    }
}

export default TodoItem;
