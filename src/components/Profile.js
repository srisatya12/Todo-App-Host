// src/components/Profile.js
import React from 'react';
import '../styles/style.css' // Import the Profile styles
const API_URL = process.env.REACT_APP_API_URL;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      email: this.props.user.email,
      password: '',
      newPassword: '',
      message: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUpdate = (e) => {
    e.preventDefault();

    const { name, email, password, newPassword } = this.state;

    fetch(`${API_URL}/api/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
      },
      body: JSON.stringify({ name, email, password, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        this.setState({ message: data.message });
        if (data.message === 'Profile updated successfully!') {
          this.props.onProfileUpdate({ name, email }); // Notify parent component of profile update
        }
      }
    })
    .catch(error => console.error('Error:', error));
  };

  handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      fetch(`${API_URL}/api/profile/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          this.setState({ message: data.message });
          this.props.onAccountDeleted(); // Notify parent component that account was deleted
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };

  render() {
    const { name, email, password, newPassword, message } = this.state;

    return (
      <div>
        <h3>Update Profile</h3>
        <form onSubmit={this.handleUpdate}>
          <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={this.handleChange} 
            placeholder="Name" 
          />
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={this.handleChange} 
            placeholder="Email" 
          />
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={this.handleChange} 
            placeholder="Enter your current password" 
          />
          <input 
            type="password" 
            name="newPassword" 
            value={newPassword} 
            onChange={this.handleChange} 
            placeholder="Enter new password (leave blank if not changing)" 
          />
          <button style={{ marginBottom: '10px' }} type="submit">Update</button>
        </form>
        <button style={{ marginBottom: '10px' }} onClick={this.handleDeleteAccount}>Delete Account</button>
        {message && <p>{message}</p>}
      </div>
    );
  }
}

export default Profile;
