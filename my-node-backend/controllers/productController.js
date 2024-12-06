// my-node-backend/controllers/productController.js
const { uploadImage, addProduct, getProducts ,getProductById } = require('../models/productModel');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

// Create a product with an uploaded image
const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).send({ message: 'Error uploading image.' });
    const { name, price, location, stock = 1, category, username ,phoneNumber,description} = req.body;
    const image = req.file;

    if (!image) return res.status(400).send({ message: 'Image file is required.' });

    try {
      // Upload the image and get the image URL
      const imageUrl = await uploadImage(image);
      // Add product to Firestore and send response
      const response = await addProduct({ name, price, location, stock, category, imageUrl, username,phoneNumber,description });
      res.status(201).send(response);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error.', error });
    }
  });
};

// Fetch all products from Firestore
const fetchProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send({ message: 'Internal server error.', error });
  }
};

const fetchProductById = async (req, res) => {
  const { productId } = req.params;
  console.log('Fetching product with ID:', productId);
  try {
    const product = await getProductById(productId);
    console.log('Fetched product:', product);

    if (!product) {
      console.log('Product not found');
      return res.status(404).send({ message: 'Product not found.' });
    }

    res.status(200).send(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).send({ message: 'Internal server error.', error });
  }
};


module.exports = { createProduct, fetchProducts, fetchProductById};
