import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { useLanguage, translate } from '../contexts/LanguageContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart, removeFromCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Fetch product data only if productId changes
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(`https://tuni-market.vercel.app/api/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
        window.history.pushState({}, '', '/404');
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  useEffect(() => {
    // Check if product and cartItems are available before running this
    if (product && cartItems) {
      onFavoriteCheck();
      checkIfInCart();
    }
  }, [product, cartItems]);

  const onFavoriteCheck = async () => {
    const userEmail = window.localStorage.getItem('email');
    try {
      const { data: favoriteProducts } = await axios.get(`https://tuni-market.vercel.app/api/getfavorites?email=${userEmail}`);
      const isFavoriteProduct = favoriteProducts.some(favorite => favorite.id === product.id);
      setIsFavorite(isFavoriteProduct);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const checkIfInCart = () => {
    const existingProduct = cartItems.find(item => item.product.id === product.id);
    setIsInCart(!!existingProduct);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsInCart(true);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    setIsInCart(false);
  };

  const handleToggleFavorite = async () => {
    const userEmail = window.localStorage.getItem('email');
    try {
      await axios.post('https://tuni-market.vercel.app/api/favorites', {
        email: userEmail,
        productId: product.id,
      });
      setIsFavorite(prevState => !prevState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Directly return null or an empty fragment if no product is found
  if (!product) return null;

  return (
    <div className="product-detail-wrapper">
      {/* Helmet for SEO */}
      <Helmet>
        <title>{product.name} - MyStore</title>
        <meta name="description" content={`Buy ${product.name} for just $${product.price}.`} />
        <meta name="keywords" content={`${product.name}, ${product.category}, buy ${product.name}, ${product.location}, TuniMarket`} />
        <link rel="canonical" href={`https://tuni-market.vercel.app/product/${product.id}`} />
      </Helmet>

      <div className="container mt-5">
        <div className="row mt-4">
          <div className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid" style={{ maxHeight: '500px', objectFit: 'contain' }} />
          </div>
          <div className="col-md-6">
            <h3>{product.name}</h3>
            <p><strong>{translate('price', language)}:</strong> ${product.price}</p>
            <p><strong>{translate('category', language)}:</strong> {translate(product.category, language)}</p> {/* Translate the category */}
            <p><strong>{translate('location', language)}:</strong> {product.location}</p>
            <p><strong>{translate('stock', language)}:</strong> {product.stock}</p>
            <p><strong>{translate('addedBy', language)}:</strong> {product.username}</p>
            <p><strong>{translate('productId', language)}:</strong> {product.id}</p>

            <div className="button-group">
              {isInCart ? (
                <button className="btn btn-warning mt-3 me-2" onClick={handleRemoveFromCart}>
                  {translate('removeFromCart', language)}
                </button>
              ) : (
                <button className="btn btn-primary mt-3 me-2" onClick={handleAddToCart}>
                  {translate('addToCart', language)}
                </button>
              )}
              <button
                className={`btn mt-3 ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? translate('removeFromFavorites', language) : translate('addToFavorites', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
