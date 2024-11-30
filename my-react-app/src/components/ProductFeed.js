import React, { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

function ProductFeed({ filteredProducts, handleProductClick }) {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation(); // Hook to get the current URL
  const categories = {
    autoparts: 'Autoparts - Find the best auto parts and accessories at TuniMarket.',
    clothes: 'Clothes - Shop for stylish clothes and accessories on TuniMarket.',
    technology: 'Technology - Explore the latest gadgets and tech products on TuniMarket.'
  };

  const categoryKeywords = {
    autoparts: 'TuniMarket, autoparts Tunisia, car accessories, buy auto parts, auto repair, online marketplace Tunisia',
    clothes: 'TuniMarket, clothes Tunisia, fashion Tunisia, buy clothes, stylish clothes, online shopping Tunisia',
    technology: 'TuniMarket, technology Tunisia, buy gadgets, electronics Tunisia, tech products, online shopping Tunisia'
  };

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

  const currentUrl = location.pathname === '/' 
  ? 'https://tunimarket.vercel.app' 
  : `https://tunimarket.vercel.app${location.pathname}`;


  const getCategoryName = () => {
    // Get category from URL (e.g., /category/Clothes)
    const pathParts = location.pathname.split('/');
    const category = pathParts[2]; // 'Clothes', 'Autoparts', 'Technology'
    return category || 'Home'; // Default to 'Home' if no category is found
  };
  
  const getCategoryDescription = () => {
    // Get category from URL (e.g., /category/Clothes)
    const pathParts = location.pathname.split('/');
    const category = pathParts[2]; // 'Clothes', 'Autoparts', 'Technology'
  
    // Check if the category exists in the URL and return the corresponding description
    // If no category is found, return the default description for the homepage
    if (category && categories[category.toLowerCase()]) {
      return categories[category.toLowerCase()];  // Matches categories like 'Clothes', 'Autoparts', 'Technology'
    }
  
    return 'Discover the best deals for buying and selling on TuniMarket, the online marketplace of Tunisia.'; // Default description for homepage or invalid category
  };

  const getCategoryKeywords = () => {
    // Get category from URL (e.g., /category/Clothes)
    const pathParts = location.pathname.split('/');
    const category = pathParts[2]; // 'Clothes', 'Autoparts', 'Technology'

    // Check if the category exists and return the corresponding keywords
    // If no category is found, return the default set of keywords
    return category && categoryKeywords[category.toLowerCase()]
      ? categoryKeywords[category.toLowerCase()]
      : 'TuniMarket, Tunisia, online shopping, buy and sell Tunisia, marketplace Tunisia';
  };

  
  return (
    <div>
      {/* Meta tags for SEO */}
      <Helmet>
        <meta name="description" content={getCategoryDescription()} />
        <meta name="keywords" content={getCategoryKeywords()} />
        <title>{`TuniMarket - ${getCategoryName() === 'Home' ? 'Buy and Sell in Tunisia' : getCategoryName()}`}</title>
        <meta name="robots" content="index, follow" />
        <meta property="og:url" content={currentUrl}/>
        <meta property="og:type" content="website"/>
        <link rel="canonical" href={currentUrl} />

     {/* Structured data (JSON-LD) for product listings */}
     <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TuniMarket - ${getCategoryName() === 'Home' ? 'Marketplace Products' : getCategoryName()}",  // Dynamic name based on category
          "description": "${getCategoryDescription()}",
          "brand": "TuniMarket",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${currentUrl}"
          },
          "url": "${currentUrl}",
          "logo": "https://tunimarket.vercel.app/Sample.jpg",
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "url": "https://tunimarket.vercel.app/returns"
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
               priority="true"

               src={product.imageUrl}
               alt={product.name}
               className="card-img-top"
               style={{ objectFit: 'cover' }}
               loading="eager" // Improve loading performance
               width="300" // Fixed width for LCP optimization
               height="200" // Fixed height for LCP optimization
               sizes="(max-width: 768px) 100vw, 33vw" // Responsive image size
 
              />
              <figcaption className="card-body text-center">
                {/* Product name */}
                <h5 className="card-title">{product.name}</h5>
                <p className="card-title">{product.price + ' DT'}</p>
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductFeed;
