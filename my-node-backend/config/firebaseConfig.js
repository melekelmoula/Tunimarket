// my-node-backend/config/firebaseConfig.js
require('dotenv').config();
const admin = require('firebase-admin');
//const serviceAccount = require('/etc/secrets/firebaseAdmin.json'); // Download this JSON from Firebase Console
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://proj-b98cd-default-rtdb.europe-west1.firebasedatabase.app', // Realtime Database URL
  storageBucket: 'proj-b98cd.appspot.com', // Firebase Storage bucket
});

// Initialize Firestore, Storage, Realtime Database, and Auth
const db = admin.firestore();
const bucket = admin.storage().bucket();
const realtimeDb = admin.database(); // Realtime Database
const authentication = admin.auth(); // Firebase Authentication

// Export initialized services
module.exports = {
  admin,
  db,
  bucket,
  authentication,
  realtimeDb,
};
