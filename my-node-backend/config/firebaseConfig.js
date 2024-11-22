// my-node-backend/config/firebaseConfig.js
const admin = require('firebase-admin');
//const serviceAccount = require('/etc/secrets/firebaseAdmin.json'); // Download this JSON from Firebase Console
const serviceAccount = process.env.FIREBASE_CONFIG;
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://proj-b98cd-default-rtdb.europe-west1.firebasedatabase.app/', // Replace with your Firebase Realtime Database URL
  storageBucket: 'proj-b98cd.appspot.com', // Replace with your Firebase Storage bucket
});

// Initialize Firestore and Storage
const db = admin.firestore();
const bucket = admin.storage().bucket();
const realtimeDb = admin.database(); // Realtime Database

// Export the admin, db, bucket, and authentication for use in other modules
module.exports = { admin, db, bucket, authentication: admin.auth() ,realtimeDb};

//gcloud alpha firestore databases update --type=firestore-native for firebase google cloud console
