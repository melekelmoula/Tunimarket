import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { useLanguage, translate } from '../contexts/LanguageContext';
import './ProductDetail.css';

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
  // Check if the product is in favorites
  const onFavoriteCheck = async () => {
  const userEmail = window.localStorage.getItem('email'); // Get user email from localStorage
  if (!userEmail) {
    // Skip API call if user is not logged in
    console.warn('User not logged in, skipping favorites check');
    return;
  }

  try {
    const { data: favoriteProducts } = await axios.get(
      `https://tuni-market.vercel.app/api/getfavorites?email=${userEmail}`
    );
    const isFavoriteProduct = favoriteProducts.some(
      (favorite) => favorite.id === product.id
    );
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
  <title>{`TuniMarket - ${product.name}`}</title>

  <meta name="description" content={`Buy ${product.name} for just ${product.price} DT. Available in ${product.location}.`} />
  <meta name="keywords" content={`${product.name}, ${product.category}, buy ${product.name}, ${product.location}, TuniMarket`} />
  <meta name="author" content="TuniMarket" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={`https://tunimarket.vercel.app/product/${product.id}`} />
  <link rel="preload" href={product.imageUrl} as="image" />

  <meta property="og:image" content={product.imageUrl || "https://tunimarket.vercel.app/default-image.jpg"} />
  <meta property="og:image:alt" content={product.name} />
  <meta property="og:url" content={`https://tunimarket.vercel.app/product/${product.id}`} />
  <meta property="og:type" content="product" />
  <meta property="og:title" content={`TuniMarket - ${product.name}`} />
  <meta property="og:description" content={`Buy ${product.name} for just ${product.price} DT. Available in ${product.location}.`} />
  <meta property="og:site_name" content="TuniMarket" />

  {/* Structured Data for Product */}
  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "${product.name}",
        "image": "${product.imageUrl}",
        "description": "Buy ${product.name} for just ${product.price} DT.",
        "sku": "${product.id}",
        "brand": "TuniMarket",
        "offers": {
          "@type": "Offer",
          "url": "https://tunimarket.vercel.app/product/${product.id}",
          "priceCurrency": "DT",
          "price": "${product.price}",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock"
        },
        "category": "${product.category}",
        "location": "${product.location}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "/product/${product.id}"
        }
      }
    `}
  </script>
</Helmet>


      <div className="container mt-3">
        <div className="row mt-4">
          {/* Product Image Section */}
          <figure className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid" style={{ maxHeight: '500px', objectFit: 'contain' }} />
          </figure>

          {/* Product Details Section */}
          <section className="col-md-6">
          <h1 style={{ color: '#649ef5' }}>{product.name}</h1>

      <p>{product.description}</p>
      <br></br>
      <div className="product-info">
    <div className="product-info-item">
      <strong>{translate('price', language)}:</strong>
      <p>{product.price} DT</p>
    </div>
    <div className="product-info-item">
      <strong>{translate('category', language)}:</strong>
      <p>{translate(product.category, language)}</p>
    </div>
  </div>

  <div className="product-info">
    <div className="product-info-item">
      <strong>{translate('location', language)}:</strong>
      <p>{product.location}</p>
    </div>
    <div className="product-info-item">
      <strong>{translate('stock', language)}:</strong>
      <p>{product.stock}</p>
    </div>
    <div className="product-info-item">
      <strong>{translate('phoneNumber', language)}:</strong>
      <p>{product.phoneNumber}</p>
    </div>
    <div className="product-info-item">
      <strong>{translate('addedBy', language)}:</strong>
      <p>{product.username}</p>
    </div>
  </div>

 
  <strong>{translate('productId', language)}:</strong>
      <p>{product.id}</p>
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
