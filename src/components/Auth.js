import React from 'react';
import '../styles/style.css';
const API_URL = process.env.REACT_APP_API_URL;
class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      isLogin: props.isLogin,
      message: '',
      errors: {}
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateFields = () => {
    const { name, email, password, isLogin } = this.state;
    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (!isLogin && !name) {
      errors.name = 'Name is required for signup';
    }

    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    const errors = this.validateFields();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    const { email, password, name, isLogin } = this.state;
    const url = isLogin
    ? `${API_URL}/api/auth/login`
    : `${API_URL}/api/auth/signup`;
  

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.props.onAuthSuccess({ name: data.name, email: data.email });
        } else {
          this.setState({ message: data.message || 'Authentication failed!' });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  render() {
    const { name, email, password, isLogin, message, errors } = this.state;

    return (
      <div>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={this.handleSubmit}>
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                placeholder="Name"
              />
              {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              placeholder="Email"
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              placeholder="Password"
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          <p style={{ color: 'black' }}>{message}</p>
        </form>
        <button onClick={() => this.setState({ isLogin: !isLogin, errors: {}, message: '' })}>
          Switch to {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
    );
  }
}

export default Auth;
