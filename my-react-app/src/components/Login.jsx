import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';
import { auth, signInWithPopup, googleProvider } from '../firebaseClient';

class Login extends Component {
  state = {
    email: '',
    password: '',
    message: ''
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  setAuthData = (data, email) => {
    window.localStorage.setItem('auth', 'true');
    window.localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
    window.localStorage.setItem('email', email);
    window.localStorage.setItem('username', email.split('@')[0]);
  };

  handleResponse = async (apiEndpoint, payload, onSuccess) => {
    try {
      const { data } = await axios.post(apiEndpoint, payload);
      this.setState({ message: data.message });

      if (data.success) {
        this.setAuthData(data, payload.email || data.email);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      this.setState({ message: 'An error occurred. Please try again.' });
      console.error(error);
    }
  };

  handleEmailLogin = () => {
    const { email, password } = this.state;
    this.handleResponse('https://tuni-market.vercel.app/auth/login', { email, password }, this.props.onLoginSuccess);
  };

  handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      this.handleResponse('https://tuni-market.vercel.app/auth/google', { idToken }, this.props.onLoginSuccess);
    } catch (error) {
      this.setState({ message: 'Google login failed.' });
      console.error(error);
    }
  };

  handleRegister = () => {
    const { email, password } = this.state;
    this.handleResponse('https://tuni-market.vercel.app/auth/register', { email, password }, this.handleEmailLogin);
  };

  render() {
    const { email, password, message } = this.state;

    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Login or Register</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleChange}
          />
          <button onClick={this.handleEmailLogin}>Login</button>
          <button onClick={this.handleGoogleLogin}>Login with Google</button>
          <button onClick={this.handleRegister}>Register</button>
          <p>{message}</p>
        </div>
      </div>
    );
  }
}

export default Login;
