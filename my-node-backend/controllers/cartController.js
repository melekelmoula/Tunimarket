// my-node-backend/controllers/cartController.js
const cartModel = require('../models/cartModel');

// Toggle product in the cart for a user
const toggleCart = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    const userDoc = await cartModel.findUserByEmail(email);
    const userData = userDoc.data();

    let cart = userData.cart || [];

    // Toggle product in the cart (add/update)
    cart = cartModel.toggleProductInCart(cart, productId, quantity);

    // Update Firestore with the new cart
    await cartModel.updateCart(userDoc, cart);

    // Return the updated cart
    const updatedCart = cart.map(item => ({ productId: item.productId, quantity: item.quantity }));
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove product from the cart
const removeFromCart = async (req, res) => {
  try {
    const { email, productId } = req.body;

    const userDoc = await cartModel.findUserByEmail(email);
    const userData = userDoc.data();

    let cart = userData.cart || [];

    // Remove product from the cart
    cart = cartModel.removeProductFromCart(cart, productId);

    // Update Firestore with the new cart
    await cartModel.updateCart(userDoc, cart);

    // Return the updated cart
    const updatedCart = cart.map(item => ({ productId: item.productId, quantity: item.quantity }));
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch the user's cart
const getCart = async (req, res) => {
  try {
    const { email } = req.query;

    const userDoc = await cartModel.findUserByEmail(email);
    const userData = userDoc.data();

    // Return the cart
    const cart = (userData.cart || []).map(item => ({ productId: item.productId, quantity: item.quantity }));
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { toggleCart, removeFromCart, getCart };
