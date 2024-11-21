const { db, admin } = require('../config/firebaseConfig');
const { auth,signInWithEmailAndPassword } = require('../config/firebaseClient');


// Google login and Firebase Authentication
const verifyGoogleIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Google Sign-In verification failed: ' + error.message);
  }
};

// Function to check if the user exists and create a new user if not
const checkAndCreateUser = async (uid, email) => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      const newUser = {
        uid,
        email,
        favorites: []  // Add any other default fields
      };
      await db.collection('users').doc(uid).set(newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error in checkAndCreateUser:', error);
    return null;
  }
};

// Handle user login
const handleUserLogin = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await user.getIdToken();
    const uid = user.uid;

    const userData = await db.collection('users').doc(uid).get();
    if (!userData.exists) {
      return { status: 404, data: { success: false, message: "User not found." } };
    }

    const userDoc = userData.data();
    const userEmail = userDoc.email;
    const favorites = userDoc.favorites || [];

    const adminDoc = await db.collection('admins').doc(uid).get();

    if (adminDoc.exists) {
      return { 
        status: 200, 
        data: { 
          success: true, 
          message: "Admin logged in successfully", 
          idToken, 
          isAdmin: true, 
          email: userEmail, 
          favorites 
        } 
      };
    } else {
      return { 
        status: 200, 
        data: { 
          success: true, 
          message: "User logged in successfully", 
          idToken, 
          isAdmin: false, 
          email: userEmail, 
          favorites 
        } 
      };
    }
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

// Handle Google login
const handleGoogleLogin = async (idToken) => {
  try {
    const decodedToken = await verifyGoogleIdToken(idToken);
    const { uid, email } = decodedToken;

    const userData = await checkAndCreateUser(uid, email);
    if (!userData) {
      return { status: 500, data: { success: false, message: 'Could not retrieve or create user data.' } };
    }

    const userEmail = userData.email;
    const favorites = userData.favorites || [];

    const adminDoc = await db.collection('admins').doc(uid).get();

    if (adminDoc.exists) {
      return {
        status: 200,
        data: {
          success: true,
          message: "Admin logged in successfully",
          idToken,
          isAdmin: true,
          email: userEmail,
          favorites
        }
      };
    } else {
      return {
        status: 200,
        data: {
          success: true,
          message: "User logged in successfully",
          idToken,
          isAdmin: false,
          email: userEmail,
          favorites
        }
      };
    }
  } catch (error) {
    throw new Error("Google login failed: " + error.message);
  }
};

// Register a new user via Google or email/password
const registerNewUser = async (email, password) => {
  try {
    const { uid, email: userEmail } = await admin.auth().createUser({ email, password });
    await db.collection('users').doc(uid).set({ email: userEmail, createdAt: new Date() });
    return { status: 201, data: { success: true, message: 'User registered successfully', uid } };
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
};

module.exports = { verifyGoogleIdToken, checkAndCreateUser, handleUserLogin, handleGoogleLogin, registerNewUser };
