// my-node-backend\models\orderModel.js
const { db, realtimeDb } = require('../config/firebaseConfig');


// Add or update a product order in Firebase Realtime Database
const addOrder = async (order) => {
  const { cartItems, username, orderDate, paymentOption, address, cardDetails, email } = order;

  try {
    // Fetch the user's cart
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    let cart = userData.cart || [];

    // Process each cart item
    for (let item of cartItems) {
      const productRef = db.collection('products').doc(item.productId); // Reference to the product document
      const orderRef = realtimeDb.ref(`orders/${item.productId}`); // Reference to the orders path in Realtime Database

      // Check if the product exists in the products collection
      const productDoc = await productRef.get();
      if (!productDoc.exists) {
        throw new Error(`Product with ID ${item.productId} does not exist`);
      }

      // Order details object
      let orderDetails = {
        username,
        email, // Include email in the order details
        totalAmount: item.quantity * item.price,
        orderDate,
        paymentOption, // Include paymentOption in the order details
        address, // Include address in the order details
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
      };

      // If the payment option is 'delivery', exclude cardDetails
      if (paymentOption !== 'delivery') {
        orderDetails.cardDetails = cardDetails; // Add cardDetails if it's not delivery
      }

      // Fetch current orders (if any) for the given productId
      const existingOrdersSnapshot = await orderRef.once('value');
      const existingOrders = existingOrdersSnapshot.val() || [];

      // Add the new order to the list of existing orders
      existingOrders.push(orderDetails);

      // Set or update the orders in the Realtime Database
      await orderRef.set(existingOrders);

      // Decrement the stock in the products collection
      const currentStock = productDoc.data().stock;
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}`);
      }

      const newStock = currentStock - item.quantity;

      // Update the stock in Firestore
      await productRef.update({
        stock: newStock,
      });

      // Remove the product if the stock reaches 0
      if (newStock === 0) {
        await productRef.delete();
        console.log(`Product with ID ${item.productId} has been removed due to zero stock.`);
      }
    }

    // After processing the order, clear the user's cart
    await db.collection('users').doc(userDoc.id).update({
      cart: [] // Clear the cart
    });

    return { message: 'Order added and product stock updated successfully!' };
  } catch (error) {
    console.error('Error adding order:', error);
    throw new Error('Error adding order');
  }
};

module.exports = { addOrder };
