const { handleUserLogin, handleGoogleLogin, registerNewUser } = require('../models/userModel');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const response = await handleUserLogin(email, password);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ success: false, message: "Login failed. Please try again." });
  }
};

// Google login
const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;

  try {
    const response = await handleGoogleLogin(idToken);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(500).send({ success: false, message: 'Google Sign-In failed. Please try again.' });
  }
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await registerNewUser(email, password);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ success: false, message: error.message || 'Error registering user' });
  }
};

module.exports = { registerUser, loginWithGoogle, handleLogin };
