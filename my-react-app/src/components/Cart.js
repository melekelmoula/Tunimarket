//my-react-app\src\components\Cart.js
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { FaTimes } from 'react-icons/fa';
import './Cart.css';
import axios from 'axios';

function Cart({ Carthide, handleSubmitOrder }) {
  const { cartItems, getTotalPrice, removeFromCart, updateQuantity } = useCart();
  const [paymentOption, setPaymentOption] = useState("credit");
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [holderName, setHolderName] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [inputCode, setInputCode] = useState('');

  const [showCodeField, setShowCodeField] = useState(false); // Track if the code input field should be shown
  const [emailSentMessage, setEmailSentMessage] = useState(''); // New state for the email sent message

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handlePaymentChange = (e) => {
    setPaymentOption(e.target.value);
  };

  const generateCode = async () => {
    const email = window.localStorage.getItem('email');
    
    if (email == null) {
      // Handle the case where the user is not logged in
      alert('Please login to submit the order');
  
      // Optionally, save cart items in localStorage if the user is not logged in
      const cartItemsToSave = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem('cartItems', JSON.stringify(cartItemsToSave));
  
      // Retrieve the cart items from localStorage and display them in an alert
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      const cartItemsAlert = savedCartItems
        .map(item => `Product ID: ${item.productId}, Quantity: ${item.quantity}`)
        .join('\n'); // Create a string of cart items
        
        alert(`Cart items saved in localStorage:\n${cartItemsAlert}`);
      return; // Exit the function
    }

    if (email != null) {
      const code = Math.floor(100000 + Math.random() * 900000);
      setOrderCode(code);
      setShowCodeField(true); // Show the order code input field after generating the code
  
      // Send the code and user's email to the backend to send the email
      try {
        const userEmail = window.localStorage.getItem('email'); // Assuming email is stored in localStorage
        const response = await axios.post('https://tuni-market.vercel.app/api/send-order-code', { // Correct API route
          email: userEmail,
          code: code,
        });
        setEmailSentMessage('The order code has been sent to your email.'); // Update the message state

      } catch (error) {
        console.error('Error sending order code email:', error);
        alert('Failed to send order code to your email. Please try again.');
      }
    } else {
      alert('Please login to submit order');
    }
  };
  

  const verifyCode = () => {
    if (orderCode == inputCode) {
      handleOrderSubmit(paymentOption, { address, cardDetails: { cardNumber, cvv2, holderName } });
    } else {
      alert("Incorrect code. Please try again.");
    }
  };

  const handleOrderSubmit = () => {
    if (!address.trim()) {
      alert('Please provide a delivery address.');
      return;
    }

    if (paymentOption === 'credit' && (!cardNumber || !cvv2 || !holderName)) {
      alert('Please provide all credit card details.');
      return;
    }

    handleSubmitOrder(paymentOption, {
      address,
      cardDetails: paymentOption === 'credit' ? { cardNumber, cvv2, holderName } : null,

    });

  };

  return (
    <div className="cart-container">
      <div className="cart-overlay">
        <div className="cart-header">
          <button className="btn-close" onClick={Carthide}></button>
        </div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(({ product, quantity }) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      max={product.stock}
                      onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                    />
                  </td>
                  <td>DT{product.price}</td>
                  <td>DT{(product.price * quantity).toFixed(2)}</td>
                  <td>
                    <button className="btn" onClick={() => removeFromCart(product.id)}>
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h4>Total: DT{getTotalPrice().toFixed(2)}</h4>

        <div className="address-field">
          <h5>Delivery Address:</h5>
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="payment-options">
          <h5>Select Payment Method:</h5>
          <label>
            <input
              type="radio"
              value="credit"
              checked={paymentOption === "credit"}
              onChange={handlePaymentChange}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              value="delivery"
              checked={paymentOption === "delivery"}
              onChange={handlePaymentChange}
            />
            Cash on Delivery
          </label>
        </div>
<br></br>
        {paymentOption === 'credit' && (
          <div className="credit-card-fields">
            <h5>Credit Card Details:</h5>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="CVV2"
              value={cvv2}
              onChange={(e) => setCvv2(e.target.value)}
            />
            <input
              type="text"
              placeholder="Card Holder Name"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
            />
          </div>
        )}

        {cartItems.length > 0 && (
          <button
            className="btn btn-primary mt-3"
            onClick={generateCode} // Fixed typo here
          >
            Submit Order
          </button>
        )}

        {/* Show the email sent message if it's set */}
        {emailSentMessage && (
          <p className="email-sent-message mt-3">{emailSentMessage}</p>
        )}

        {showCodeField && ( // Only show the code field if the code was generated
          <div className="order-code-field mt-3">
            <input
              type="text"
              placeholder="Enter Order Code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>
        )}
        
        {showCodeField && (
          <button
            className="btn btn-primary mt-3"
            onClick={verifyCode} // Fixed typo here
          >
            Confirm Order
          </button>
        )}
      </div>
    </div>
  );
}

export default Cart;
