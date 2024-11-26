import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

//public uredirects important for deployement redirection 

root.render(
  <BrowserRouter>
    <LanguageProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/product/:productId" element={<App />} />
        </Routes>
      </CartProvider>
    </LanguageProvider>
  </BrowserRouter>
);
