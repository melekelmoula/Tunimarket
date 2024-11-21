// my-node-backend/controllers/favoriteController.js
const favoriteModel = require('../models/favoriteModel');

// Toggle favorite product for a user
const toggleFavorite = async (req, res) => {
  try {
    const { email, productId } = req.body;

    // Find the user by email
    const userDoc = await favoriteModel.findUserByEmail(email);
    const userData = userDoc.data();

    let favorites = userData.favorites || [];

    // Toggle the favorite product
    favorites = favoriteModel.toggleFavoriteProduct(favorites, productId);

    // Update Firestore with the new favorites list
    await favoriteModel.updateFavorites(userDoc, favorites);

    // Return the updated favorites
    const updatedFavorites = favorites.map(favorite => ({ id: favorite }));
    res.json({ success: true, favorites: updatedFavorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the user's favorite products
const getFavorites = async (req, res) => {
  try {
    const { email } = req.query; // Assuming email is passed as a query parameter

    // Find the user by email
    const userDoc = await favoriteModel.findUserByEmail(email);
    const userData = userDoc.data();

    // Map favorites to an array of objects with id properties
    const favorites = (userData.favorites || []).map(favorite => ({ id: favorite }));
    
    // Send the favorites array as the response
    return res.status(200).send(favorites);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { toggleFavorite, getFavorites };
