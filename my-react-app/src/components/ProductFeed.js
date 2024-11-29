import React, { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';
import { Helmet } from 'react-helmet';

function ProductFeed({ filteredProducts, handleProductClick }) {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} handleBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div>
      {/* Meta tags for SEO */}
      <Helmet>
        <meta name="description" content="Discover the best deals for buying and selling on TuniMarket, the online marketplace of Tunisia." />
        <meta name="keywords" content="TuniMarket, Tunisia, online shopping, buy and sell Tunisia, marketplace Tunisia" />
        <meta property="og:title" content="TuniMarket - Buy and Sell in Tunisia" />
        <meta property="og:description" content="The best site to buy and sell in Tunisia. Explore exclusive products on TuniMarket." />
        <meta property="og:url" content={`https://tunimarket.vercel.app`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://tunimarket.vercel.app`} />
        <link rel="preload" href="/assets/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin="anonymous" />

        {/* Structured data (JSON-LD) for product listings */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "TuniMarket - Marketplace Products",
              "image": "${visibleProducts[0]?.imageUrl}",
              "description": "Browse top products on TuniMarket.",
              "brand": "TuniMarket",
              "offers": {
                "@type": "Offer",
                "url": "https://tunimarket.vercel.app",
                "priceCurrency": "TND",
                "price": "${visibleProducts[0]?.price}",
                "priceValidUntil": "2024-12-31",
                "availability": "https://schema.org/InStock"
              }
            }
          `}
        </script>

        {/* Preload images */}
        {visibleProducts.map((product) => (
          <link key={product.id} rel="preload" href={product.imageUrl} as="image" />
        ))}
      </Helmet>

      <div className="row mt-4">
        {/* Mapping over filtered and visible products */}
        {visibleProducts.map((product) => (
          <article key={product.id} className="col-md-4 mb-4" onClick={() => handleProductClick(product)}>
            <figure className="card h-100 shadow-sm">
              {/* Product image */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
                loading="lazy" // Improve loading performance
              />
              <figcaption className="card-body text-center">
                {/* Product name */}
                <h5 className="card-title">{product.name}</h5>
                <h7 className="card-title">{product.price + ' TND'}</h7>
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductFeed;
