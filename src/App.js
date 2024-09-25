import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import Profile from './components/Profile'; // Import the App styles

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
    };
  }

  handleAuthSuccess = (userData) => {
    this.setState({ isAuthenticated: true, user: userData });
  };

  handleProfileUpdate = (updatedUserData) => {
    this.setState({ user: updatedUserData });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ isAuthenticated: false, user: null });
  };

  handleAccountDeleted = () => {
    this.setState({ isAuthenticated: false, user: null });
    localStorage.removeItem('token');
    alert('Your account has been deleted.');
  };

  render() {
    const { isAuthenticated, user } = this.state;
    return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/todos" /> : <Auth onAuthSuccess={this.handleAuthSuccess} />} />
            <Route path="/todos" element={isAuthenticated ? (
              <div>
                <h2>Welcome, {user.name}!</h2>
                <TodoList />
                <Profile user={user}
                         onProfileUpdate={this.handleProfileUpdate}
                         onAccountDeleted={this.handleAccountDeleted} />
                <button onClick={this.handleLogout}>Logout</button>
              </div>
            ) : (
              <Navigate to="/" />
            )} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
