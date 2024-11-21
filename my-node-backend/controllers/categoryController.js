//my-node-backend\controllers\categoryController.js
const { getCategories } = require('../models/categoryModel');

// Fetch categories from the database and send response
const fetchCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).send(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ message: 'Internal server error.', error });
  }
};

module.exports = { fetchCategories };
