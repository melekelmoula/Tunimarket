import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { auth, signInWithPopup, googleProvider } from '../firebaseClient';
import { useLanguage, translate } from '../contexts/LanguageContext';

const Login = ({ onLoginSuccess }) => {
  // Language context to support internationalization (i18n)
  const { language } = useLanguage();

  // State hooks to manage form inputs and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  // Centralized response handler for API requests
  const handleResponse = async (apiEndpoint, payload, onSuccess) => {
    try {
      // Send POST request with payload and await response
      const { data } = await axios.post(apiEndpoint, payload);
      
      // Display message based on response from API
      setMessage(data.message);

      if (data.success) {
        // If successful, store auth data and trigger onLoginSuccess callback
        setAuthData(data, payload.email || data.email);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      // Show error message if the request fails
      setMessage(translate('errorOccurred', language));
      console.error(error);
    }
  };

  // Function to store authentication data in localStorage
  const setAuthData = (data, email) => {
    window.localStorage.setItem('auth', 'true');
    window.localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
    window.localStorage.setItem('email', email);
    window.localStorage.setItem('username', email.split('@')[0]);
  };

  // Handle email login functionality
  const handleEmailLogin = () => {
    handleResponse('https://tuni-market.vercel.app/auth/login', { email, password }, onLoginSuccess);
  };

  // Handle Google login functionality using Firebase
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      handleResponse('https://tuni-market.vercel.app/auth/google', { idToken }, onLoginSuccess);
    } catch (error) {
      // Show error message if Google login fails
      setMessage(translate('googleLoginFailed', language));
      console.error(error);
    }
  };

  // Handle user registration or toggle between login and registration forms
  const handleRegister = () => {
    if (isRegistering) {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        setMessage(translate('passwordMismatch', language));
        return;
      }
      // Proceed to register the user if passwords match
      handleResponse('https://tuni-market.vercel.app/auth/register', { email, password }, handleEmailLogin);
    } else {
      setIsRegistering(true);
      setMessage('');
    }
  };

  // Cancel registration and reset the form
  const handleCancelRegistration = () => {
    setIsRegistering(false);
    setConfirmPassword('');
    setMessage('');
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-form card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">
          {isRegistering ? translate('register', language) : translate('login', language)}
        </h2>
        
        {/* Email input */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder={translate('email', language)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {/* Password input */}
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder={translate('password', language)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* Conditionally render confirm password field for registration */}
        {isRegistering && (
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder={translate('confirmPassword', language)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {/* Login with email and Google buttons */}
        {!isRegistering && (
          <>
            <button className="btn btn-primary w-100 mb-2" onClick={handleEmailLogin}>
              {translate('login', language)}
            </button>
            <button className="btn btn-danger w-100 mb-3" onClick={handleGoogleLogin}>
              {translate('loginWithGoogle', language)}
            </button>
          </>
        )}

        {/* Register or confirm registration button */}
        <button
          className="btn btn-success w-100 mb-2"
          onClick={handleRegister}
        >
          {isRegistering ? translate('confirmRegistration', language) : translate('register', language)}
        </button>
        
        {/* Cancel registration button */}
        {isRegistering && (
          <button className="btn btn-secondary w-100" onClick={handleCancelRegistration}>
            {translate('cancel', language)}
          </button>
        )}

        {/* Display any messages (errors or success) */}
        {message && <p className="mt-3 text-center text-danger">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
