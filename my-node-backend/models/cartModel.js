// my-node-backend/models/cartModel.js
const { db } = require('../config/firebaseConfig');

// Find the user by email
const findUserByEmail = async (email) => {
  const userSnapshot = await db.collection('users').where('email', '==', email).get();
  if (userSnapshot.empty) {
    throw new Error('User not found');
  }
  return userSnapshot.docs[0];
};

// Update the user's cart
const updateCart = async (userDoc, cart) => {
  await userDoc.ref.update({ cart });
};

// Add or update the product in the cart
const toggleProductInCart = (cart, productId, quantity) => {
  const existingProductIndex = cart.findIndex(item => item.productId === productId);
  if (existingProductIndex >= 0) {
    cart[existingProductIndex].quantity = quantity;
  } else {
    cart.push({ productId, quantity });
  }
  return cart;
};

// Remove product from the cart
const removeProductFromCart = (cart, productId) => {
  return cart.filter(item => item.productId !== productId);
};

module.exports = {
  findUserByEmail,
  updateCart,
  toggleProductInCart,
  removeProductFromCart
};
