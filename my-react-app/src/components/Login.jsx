import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { auth, signInWithPopup, googleProvider } from '../firebaseClient';
import { useLanguage, translate } from '../contexts/LanguageContext';

const Login = ({ onLoginSuccess }) => {
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleResponse = async (apiEndpoint, payload, onSuccess) => {
    try {
      const { data } = await axios.post(apiEndpoint, payload);
      setMessage(data.message);

      if (data.success) {
        setAuthData(data, payload.email || data.email);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setMessage(translate('errorOccurred', language));
      console.error(error);
    }
  };

  const setAuthData = (data, email) => {
    window.localStorage.setItem('auth', 'true');
    window.localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
    window.localStorage.setItem('email', email);
    window.localStorage.setItem('username', email.split('@')[0]);
  };

  const handleEmailLogin = () => {
    handleResponse('https://tuni-market.vercel.app/auth/login', { email, password }, onLoginSuccess);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      handleResponse('https://tuni-market.vercel.app/auth/google', { idToken }, onLoginSuccess);
    } catch (error) {
      setMessage(translate('googleLoginFailed', language));
      console.error(error);
    }
  };

  const handleRegister = () => {
    if (isRegistering) {
      if (password !== confirmPassword) {
        setMessage(translate('passwordMismatch', language));
        return;
      }
      handleResponse('https://tuni-market.vercel.app/auth/register', { email, password }, handleEmailLogin);
    } else {
      setIsRegistering(true);
      setMessage('');
    }
  };

  const handleCancelRegistration = () => {
    setIsRegistering(false);
    setConfirmPassword('');
    setMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-center">
          {isRegistering ? translate('register', language) : translate('login', language)}
        </h2>
        <input
          type="email"
          className="form-control"
          placeholder={translate('email', language)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          placeholder={translate('password', language)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegistering && (
          <input
            type="password"
            className="form-control"
            placeholder={translate('confirmPassword', language)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {!isRegistering && (
          <>
            <button className="btn-primary" onClick={handleEmailLogin}>
              {translate('login', language)}
            </button>
            <button className="btn-google" onClick={handleGoogleLogin}>
              {translate('loginWithGoogle', language)}
            </button>
          </>
        )}
        <button className="btn-success" onClick={handleRegister}>
          {isRegistering ? translate('confirmRegistration', language) : translate('register', language)}
        </button>
        {isRegistering && (
          <button className="btn-secondary" onClick={handleCancelRegistration}>
            {translate('cancel', language)}
          </button>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
