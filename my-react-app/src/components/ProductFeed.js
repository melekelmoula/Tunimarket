//my-react-app\src\components\ProductFeed.js
import React, { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';

function ProductFeed({ filteredProducts, handleProductClick }) {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product

  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, productsToShow));
  }, [filteredProducts, productsToShow]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      setProductsToShow((prev) => prev + 8);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} handleBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="row mt-4">
      {visibleProducts.map((product) => (
        <div key={product.id} className="col-md-4 mb-4" onClick={() => handleProductClick(product)}>
          <div className="card h-100 shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{product.name}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductFeed;
