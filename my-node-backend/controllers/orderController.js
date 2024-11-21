//my-node-backend\controllers\orderController.js
const { addOrder } = require('../models/orderModel');

// Handle order submission
const submitOrder = async (req, res) => {
  const { cartItems, username, totalAmount, orderDate, paymentOption, address, cardDetails, email} = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).send({ message: 'No items in the cart' });
  }

  try {
    const response = await addOrder({ cartItems, username, totalAmount, orderDate, paymentOption, address, cardDetails, email});
    res.status(201).send({ message: 'Order submitted successfully!', response });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).send({ message: 'Error submitting order', error });
  }
};


module.exports = { submitOrder };
