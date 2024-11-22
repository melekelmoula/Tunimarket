// my-react-app\src\firebaseClient.js

const { initializeApp } = require("firebase/app");
const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDwpSr1Rg4bxwxRdEN9imQUSNV-qOQxFUI",
  authDomain: "proj-b98cd.firebaseapp.com",
  projectId: "proj-b98cd",
  storageBucket: "proj-b98cd.appspot.com",
  messagingSenderId: "916741793206",
  appId: "1:916741793206:web:313088bd8b894ff0018d17"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

module.exports = { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword };
