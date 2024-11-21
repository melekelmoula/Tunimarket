// my-node-backend/routes/approutes.js

const express = require('express');
const { registerUser, loginWithGoogle, handleLogin } = require('../controllers/authController');
const { createProduct, fetchProducts, fetchProductById } = require('../controllers/productController');
const { fetchCategories } = require('../controllers/categoryController');
const { submitOrder } = require('../controllers/orderController');
const { sendOrderCodeEmail } = require('../controllers/emailController');
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { toggleCart, getCart, removeFromCart } = require('../controllers/cartController');

const router = express.Router();

// Define routes
router.post('/api/products', createProduct);       // Create a new product
router.post('/auth/register', registerUser);       // Register a new user
router.post('/auth/google', loginWithGoogle);
router.post('/auth/login', handleLogin);
router.post('/api/orders', submitOrder);           // Add a new order
router.post('/api/send-order-code', sendOrderCodeEmail); // Send order code email
router.post('/api/favorites', toggleFavorite);     // Add or remove favorites

router.get('/api/products', fetchProducts);        // Fetch all products
router.get('/api/products/:productId', fetchProductById);  // Fetch product by ID
router.get('/api/categories', fetchCategories);    // Fetch product categories
router.get('/api/getfavorites', getFavorites);     // Fetch favorites
router.post('/api/cart', toggleCart);              // Add or update product in the cart
router.post('/api/cart/remove', removeFromCart);   // Remove product from cart
router.get('/api/cart', getCart);                  // Get the cart of a user

module.exports = router;
