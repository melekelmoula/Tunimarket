// my-node-backend/models/favoriteModel.js
const { db } = require('../config/firebaseConfig');

// Find the user by email
const findUserByEmail = async (email) => {
  const userSnapshot = await db.collection('users').where('email', '==', email).get();
  if (userSnapshot.empty) {
    throw new Error('User not found');
  }
  return userSnapshot.docs[0];
};

// Update the user's favorites
const updateFavorites = async (userDoc, favorites) => {
  await userDoc.ref.update({ favorites });
};

// Toggle the product in the favorites list
const toggleFavoriteProduct = (favorites, productId) => {
  if (favorites.includes(productId)) {
    // Remove product from favorites
    return favorites.filter(id => id !== productId);
  } else {
    // Add product to favorites
    favorites.push(productId);
    return favorites;
  }
};

module.exports = {
  findUserByEmail,
  updateFavorites,
  toggleFavoriteProduct
};
