const express = require('express');
const { registerUser, loginWithGoogle, handleLogin } = require('../controllers/authController');
const { createProduct, fetchProducts, fetchProductById } = require('../controllers/productController');
const { fetchCategories } = require('../controllers/categoryController');
const { submitOrder } = require('../controllers/orderController');
const { sendOrderCodeEmail } = require('../controllers/emailController');
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { addToCart, getCart, removeFromCart, updateCartQuantity } = require('../controllers/cartController');
const { decodeToken } = require('../middleware/index');
const { generateSitemap } = require('../controllers/sitemapController');  // Import generateSitemap

const router = express.Router();

// Public Routes
router.post('/auth/register', registerUser);         // Register a new user
router.post('/auth/google', loginWithGoogle);        // Google login
router.post('/auth/login', handleLogin);             // Email login

router.get('/api/products', fetchProducts);          // Fetch all products
router.get('/api/products/:productId', fetchProductById); // Fetch product by ID
router.get('/api/categories', fetchCategories);      // Fetch product categories

// Protected Routes - Require decodeToken middleware
router.post('/api/products', decodeToken, createProduct); 
router.post('/api/orders', decodeToken, submitOrder);      
router.post('/api/send-order-code', decodeToken, sendOrderCodeEmail);
router.post('/api/favorites', decodeToken, toggleFavorite);
router.get('/api/getfavorites', decodeToken, getFavorites);

router.post('/api/cart', decodeToken, addToCart);    
router.delete('/api/cart', decodeToken, removeFromCart); 
router.put('/api/cart', decodeToken, updateCartQuantity);
router.get('/api/cart', decodeToken, getCart);       
router.post('/api/generate-sitemap', (req, res) => {
  const { products, categories } = req.body;
  
  if (!products || !categories) {
    return res.status(400).json({ message: 'Products and categories are required' });
  }

  try {
    generateSitemap(products, categories);  // Generate the sitemap with the passed data
    res.status(200).json({ message: 'Sitemap generated successfully' });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
});
// Health Check Route
router.get('/', (req, res) => {
  res.send('Hey! Your server is up and running 🚀');
});

module.exports = router;
