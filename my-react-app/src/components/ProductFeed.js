import React, { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';
import { Helmet } from 'react-helmet';

function ProductFeed({ filteredProducts, handleProductClick }) {
  // State to manage visible products based on the number of products to show
  const [visibleProducts, setVisibleProducts] = useState([]);
  // State to manage the number of products to display as user scrolls
  const [productsToShow, setProductsToShow] = useState(8);
  // State to track the selected product when a user clicks on a product card
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Effect to update visible products when filteredProducts or productsToShow changes
  useEffect(() => {
    // Update the visibleProducts based on the productsToShow limit
    setVisibleProducts(filteredProducts.slice(0, productsToShow));
  }, [filteredProducts, productsToShow]);

  // Handle scroll event to detect when to load more products
  const handleScroll = () => {
    // When user scrolls to the bottom of the page, show more products
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      // Increase the number of products to show (loads 8 more products)
      setProductsToShow((prev) => prev + 8);
    }
  };

  // Setting up the scroll event listener on component mount and clean it up on unmount
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If a product is selected, show the product details page
  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} handleBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div>
      {/* Meta tags for SEO */}
      <Helmet>
        <meta name="description" content="Discover the best deals for buying and selling on TuniMarket, the online marketplace of Tunisia." />
        <meta name="keywords" content="TuniMarket, Tunisia, online shopping, buy and sell Tunisia, market Tunisia" />
        <meta property="og:title" content="TuniMarket - Buy and Sell in Tunisia" />
        <meta property="og:description" content="The best site to buy and sell in Tunisia. Explore exclusive products on TuniMarket." />
      </Helmet>

      <div className="row mt-4">
        {/* Mapping over the filtered and visible products */}
        {visibleProducts.map((product) => (
          <article key={product.id} className="col-md-4 mb-4" onClick={() => handleProductClick(product)}>
            <figure className="card h-100 shadow-sm">
              {/* Product image */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <figcaption className="card-body text-center">
                {/* Product name */}
                <h5 className="card-title">{product.name}</h5>
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductFeed;
