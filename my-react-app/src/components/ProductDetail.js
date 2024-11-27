import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { useLanguage, translate } from '../contexts/LanguageContext';

const ProductDetail = () => {
  const { productId } = useParams(); // Retrieve product ID from the URL
  const { addToCart, removeFromCart, cartItems } = useCart(); // Access cart actions and current cart items
  const [product, setProduct] = useState(null); // State to store product details
  const [isFavorite, setIsFavorite] = useState(false); // State to check if product is in favorites
  const [isInCart, setIsInCart] = useState(false); // State to check if product is in the cart
  const { language } = useLanguage(); // Access current language for translations

  // useEffect to fetch product data when the component mounts or when the productId changes
  useEffect(() => {
    // Fetch product data from API
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(`https://tuni-market.vercel.app/api/products/${productId}`);
        setProduct(data); // Store fetched product data in state
      } catch (error) {
        console.error('Error fetching product data:', error);
        window.history.pushState({}, '', '/404'); // Redirect to 404 if product data fetching fails
      }
    };

    if (productId) {
      fetchProductData(); // Only fetch if productId exists
    }
  }, [productId]);

  // useEffect to check cart and favorites when product and cartItems are available
  useEffect(() => {
    if (product && cartItems) {
      onFavoriteCheck(); // Check if product is in favorites
      checkIfInCart(); // Check if product is in the cart
    }
  }, [product, cartItems]); // Run whenever product or cartItems change

  // Check if the product is in favorites
  const onFavoriteCheck = async () => {
    const userEmail = window.localStorage.getItem('email'); // Get user email from localStorage
    try {
      const { data: favoriteProducts } = await axios.get(`https://tuni-market.vercel.app/api/getfavorites?email=${userEmail}`);
      const isFavoriteProduct = favoriteProducts.some(favorite => favorite.id === product.id);
      setIsFavorite(isFavoriteProduct); // Update favorite status
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Check if the product is already in the cart
  const checkIfInCart = () => {
    const existingProduct = cartItems.find(item => item.product.id === product.id);
    setIsInCart(!!existingProduct); // Set in cart status based on whether the product is found
  };

  // Add product to cart
  const handleAddToCart = () => {
    addToCart(product, 1); // Add one unit of the product to the cart
    setIsInCart(true); // Update in cart status
  };

  // Remove product from cart
  const handleRemoveFromCart = () => {
    removeFromCart(product.id); // Remove product from cart
    setIsInCart(false); // Update in cart status
  };

  // Toggle product in favorites
  const handleToggleFavorite = async () => {
    const userEmail = window.localStorage.getItem('email'); // Get user email from localStorage
    if (!userEmail) {
      alert('Please login to add to favorites'); // Notify user if not logged in
      return;
    }
    try {
      await axios.post('https://tuni-market.vercel.app/api/favorites', {
        email: userEmail,
        productId: product.id,
      });
      setIsFavorite(prevState => !prevState); // Toggle favorite status
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // If no product data is available, return null (render nothing)
  if (!product) return null;

  return (
    <article className="product-detail-wrapper">
      <Helmet>
        <title>{product.name} - MyStore</title>
        <meta name="description" content={`Buy ${product.name} for just ${product.price}TND.`} />
        <meta name="keywords" content={`${product.name}, ${product.category}, buy ${product.name}, ${product.location}, TuniMarket`} />
        <link rel="canonical" href={`https://tuni-market.vercel.app/product/${product.id}`} />
        <link rel="preload" href={product.imageUrl} as="image" />

      </Helmet>

      <div className="container mt-3">
        <div className="row mt-4">
          {/* Product Image Section */}
          <figure className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid" style={{ maxHeight: '500px', objectFit: 'contain' }} />
          </figure>

          {/* Product Details Section */}
          <section className="col-md-6">
            <h1>{product.name}</h1>
            <p><strong>{translate('price', language)}:</strong> {product.price}TND</p>
            <p><strong>{translate('category', language)}:</strong> {translate(product.category, language)}</p>
            <p><strong>{translate('location', language)}:</strong> {product.location}</p>
            <p><strong>{translate('stock', language)}:</strong> {product.stock}</p>
            <p><strong>{translate('addedBy', language)}:</strong> {product.username}</p>
            <p><strong>{translate('productId', language)}:</strong> {product.id}</p>

            {/* Action Buttons */}
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
          </section>
        </div>
      </div>
    </article>
  );
};

export default ProductDetail;
