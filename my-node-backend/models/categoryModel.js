const { realtimeDb } = require('../config/firebaseConfig');

// Fetch all categories from Realtime Database
const getCategories = async () => {
  try {
    const snapshot = await realtimeDb.ref('categories').once('value');
    const categories = [];
    
    // Check if there are any categories and loop through them
    if (snapshot.val()) {
      for (let key in snapshot.val()) {
        categories.push({
          id: key, // category ID
          ...snapshot.val()[key], // spread the rest of the category data
        });
      }
    }

    return categories; // Return the array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Throw error if there's an issue
  }
};

module.exports = { getCategories };
