// my-node-backend/models/productModel.js
const { db, bucket } = require('../config/firebaseConfig');

// Upload image to Firebase Storage and return the image URL
const uploadImage = async (image) => {
  const blob = bucket.file(image.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: image.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', async () => {
      try {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
        resolve(imageUrl);
      } catch (error) {
        reject(new Error('Error retrieving image metadata'));
      }
    });
    blobStream.end(image.buffer);
  });
};
// my-node-backend/models/productModel.js

// Add a new product to Firestore
const addProduct = async (product) => {
  const { name, price, location, stock = 1, category, imageUrl, username ,phoneNumber,description} = product;
  try {
    const productRef = await db.collection('products').add({
      name, price: parseFloat(price), location, stock: parseInt(stock), category, imageUrl, username,phoneNumber,description
    });
    return { message: 'Product added successfully!', imageUrl, id: productRef.id };
  } catch (error) {
    throw new Error('Error adding product');
  }
};

// Fetch all products from Firestore
const getProducts = async () => {
  try {
    const snapshot = await db.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Error fetching products');
  }
};

const getProductById = async (productId) => {
  console.log('Attempting to fetch product with ID:', productId);  // Log the productId being searched for
  try {
    const doc = await db.collection('products').doc(productId).get();
    console.log('Firestore document snapshot:', doc.exists);  // Log if the document exists

    if (!doc.exists) {
      console.log('Product not found for ID:', productId);  // Log when the product is not found
      return null;
    }

    const productData = { id: doc.id, ...doc.data() };
    console.log('Product found:', productData);  // Log the product data when found
    return productData;
  } catch (error) {
    console.error('Error fetching product by ID:', error);  // Log the error if fetching fails
    throw new Error('Error fetching product by ID');
  }
};


module.exports = { uploadImage, addProduct, getProducts,getProductById };
