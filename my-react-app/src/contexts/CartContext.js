//my-react-app\src\contexts\CartContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async (email) => {
    try {
      const response = await axios.get(`https://tuni-market.vercel.app/api/cart`, { params: { email } });
      //alert(JSON.stringify(response.data, null, 2)); // Shows formatted cart items in the alert

      return response; // Return the response

    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product, quantity) => {
    const email = window.localStorage.getItem('email');
    
    // Check if the product is already in the cart
    const existingProductIndex = cartItems.findIndex(item => item.product.id === product.id);
    
    // If the product is in the cart, update the quantity
    const updatedQuantity = existingProductIndex >= 0
      ? cartItems[existingProductIndex].quantity + quantity
      : quantity;
    
    // Ensure the quantity does not exceed stock
    const finalQuantity = Math.min(updatedQuantity, product.stock);
  
    if (email) {
      try {
        if (existingProductIndex >= 0) {
          // Update quantity in the cart via API
          await axios.put('https://tuni-market.vercel.app/api/cart', {
            email,
            productId: product.id,
            quantity: finalQuantity,
          });
        } else {
          // Add the product to the cart via API
          await axios.post('https://tuni-market.vercel.app/api/cart', {
            email,
            productId: product.id,
            quantity: finalQuantity,
          });
        }
      } catch (error) {
        console.error('Error updating or adding product to cart:', error);
      }
    }
  
    // Update the cart locally
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      if (existingProductIndex >= 0) {
        updatedItems[existingProductIndex].quantity = finalQuantity;
      } else {
        updatedItems.push({ product, quantity: finalQuantity });
      }
      return updatedItems;
    });
  };
  
  
  

  const additemnotloggedindatabase = async (product, quantity) => {
    const email = window.localStorage.getItem('email');
        try {
          await axios.post('https://tuni-market.vercel.app/api/cart', {
            email,
            productId: product.id,
            quantity,
          });
          
        } catch (error) {
          console.error('Error adding product to cart:', error);
        }
  };
  
  const removeFromCart = async (productId) => {
    const email = window.localStorage.getItem('email');
  
    setCartItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
  
    if (email != null) {
      try {
        await axios.delete('https://tuni-market.vercel.app/api/cart', {
          data: { email, productId }, // Pass the data object for DELETE requests
        });
      } catch (error) {
        console.error('Error removing product from cart:', error);
      }
    }
  };
  
  

  // Update product quantity in cart
  const updateQuantity = async (productId, newQuantity) => {
    const email = window.localStorage.getItem('email');
  
    // Update the local state optimistically
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: parseInt(newQuantity, 10) };
        }
        return item;
      });
      return updatedItems;
    });
  
    // Update the server
    if (email != null) {
      try {
        await axios.put('https://tuni-market.vercel.app/api/cart', {
          email,
          productId,
          quantity: newQuantity,
        });
      } catch (error) {
        console.error('Error updating product quantity:', error);
      }
    }
  };
  

  const clearCart = () => {
    setCartItems([]); // Reset cartItems when the user logs out
};

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems,setCartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, cartItemCount ,fetchCart , clearCart,additemnotloggedindatabase}}>
      {children}
    </CartContext.Provider>
  );
};

// Export CartContext directly
export { CartContext };
