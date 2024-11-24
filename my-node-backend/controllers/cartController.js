// my-node-backend/controllers/cartController.js
const cartModel = require('../models/cartModel');

// Toggle product in the cart for a user
const addToCart = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    const userDoc = await cartModel.findUserByEmail(email);
    const userData = userDoc.data();

    let cart = userData.cart || [];

    // Toggle product in the cart (add/update)
    cart = cartModel.addProductInCart(cart, productId, quantity);

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
    const { email, productId } = req.body; // DELETE requests with body are supported

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

// Update the quantity of a product in the cart
const updateCartQuantity = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    const userDoc = await cartModel.findUserByEmail(email);
    const userData = userDoc.data();

    let cart = userData.cart || [];

    // Update the quantity of the product in the cart
    const productIndex = cart.findIndex(item => item.productId === productId);
    if (productIndex > -1) {
      // Update quantity
      cart[productIndex].quantity = quantity;
    } else {
      // Add new product if not already in cart
      cart.push({ productId, quantity });
    }

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
    const cart = await cartModel.getUserCart(email); // Use getUserCart here instead of getCart
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addToCart, removeFromCart, getCart ,updateCartQuantity};
