//my-react-app\src\App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductForm from './components/AddProductForm';
import Navbar from './components/Navbar';
import ProductFeed from './components/ProductFeed';
import { FaSignInAlt, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import './App.css';
import Cart from './components/Cart';
import LoginForm from './components/Login';
import ProductDetail from './components/ProductDetail';
import { useCart } from './contexts/CartContext'; 
import { useLanguage, translate } from './contexts/LanguageContext'; // Import useLanguage and translate
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import { useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf"; // Import jsPDF

function App() {
  const [formData, setFormData] = useState({ name: '', price: 0, image: null, location: '', stock: 1, category: '', username: '', email: '' ,description:"",phoneNumber:""});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [displayCategory, setDisplayCategory] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showProductFeed, setShowProductFeed] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const username = window.localStorage.getItem('username');
  const email = window.localStorage.getItem('email');
  const [favProducts, setFavProducts] = useState([]);
  const { cartItems, setCartItems } = useCart();  // Get cartItems from context
  const { fetchCart } = useCart(); // Access the fetchCart function from CartContext
  const { addToCart } = useCart();
  const { removeFromCart } = useCart();
  const { additemnotloggedindatabase } = useCart();
  const { language } = useLanguage(); // Get the current language from context
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation();
  const [currentSelectedProduct, setCurrentSelectedProduct] = useState(null); // global in the component scope
  const [selectedCategory, setSelectedCategory] = useState(null); // For storing selected category

  const { clearCart } = useCart();

  const [allproducts, setllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and products
        const { data: categoriesData } = await axios.get('https://tuni-market.vercel.app/api/categories');
        const { data: productsData } = await axios.get('https://tuni-market.vercel.app/api/products');
        setProducts(productsData);
        setllProducts(productsData);
        setCategories(categoriesData);
  
        // Fetch the sitemap.xml to check the lastmod date of the first URL
        const response = await axios.get('https://tunimarket.vercel.app/sitemap.xml');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "application/xml");
        const lastmod = xmlDoc.getElementsByTagName("lastmod")[0]?.textContent;

        if (!lastmod) {
          // If no lastmod is found, generate a new sitemap
          await axios.post('https://tuni-market.vercel.app/api/generate-sitemap', {
            products: productsData,
            categories: categoriesData,
          });
          console.log('Sitemap generated because no lastmod was found.');
        } else {
          const lastmodDate = new Date(lastmod);
          const currentDate = new Date();
          /*
          const formattedCurrentDate = currentDate.toLocaleDateString('en-GB', {
            year: '2-digit',
            month: 'short',
            day: '2-digit'
          }).replace(',', '');
          
          const formattedLastmodDate = lastmodDate.toLocaleDateString('en-GB', {
            year: '2-digit',
            month: 'short',
            day: '2-digit'
          }).replace(',', '');
          
          alert(`Lastmod found: ${formattedCurrentDate}`); //Lastmod2 found 30 nov 24  
          alert(`Lastmod2 found: ${formattedLastmodDate}`); //Lastmod2 found 29 oct 24 
          */
          // Get the difference in milliseconds between the two dates
          const diffTime = Math.abs(currentDate - lastmodDate);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          //alert (diffDays)
          // Compare the month and year of lastmod with the current date
          if (diffDays>12) {
            // If they are different, generate a new sitemap
            await axios.post('https://tuni-market.vercel.app/api/generate-sitemap', {
              products: productsData,
              categories: categoriesData,
            });
            console.log('Sitemap generated because lastmod is outdated.');
          } else {
            console.log('Sitemap is already up-to-date.');
          }
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    if (!isAdmin) {
      fetchData();
    }
  }, [isAdmin]);
  

  useEffect(() => {
    const storedUsername = window.localStorage.getItem('username');
    const storedIsAdmin = window.localStorage.getItem('isAdmin') === 'true';
    const storedEmail = window.localStorage.getItem('email');
    const idToken = window.localStorage.getItem('idToken');  // Get the token from localStorage

    if (storedUsername && storedEmail&&idToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      setIsLoggedIn(true);
      setIsAdmin(storedIsAdmin);
      onLoginSuccess(); // Optionnel : récupérer le panier ou d'autres données utilisateur
    }
  }, []);



  useEffect(() => {
    // Check if the URL contains '/product/' and extract the product ID
    const match = location.pathname.match(/\/product\/([^/]+)/);
    if (match && match[1]) {
      const productId = match[1];
  
      // Find the product in the current list or fetch it from the API
      const product = products.find((prod) => prod.id === productId);
      if (product) {
        setSelectedProduct(product);
      } else {
        // If not found in the current list, fetch it from the server
        axios
          .get(`https://tuni-market.vercel.app/api/products/${productId}`)
          .then((response) => setSelectedProduct(response.data))
          .catch((error) => console.error('Error fetching product:', error));
      }
    }
  }, [location.pathname, products]);
  

// Listen to changes in URL
useEffect(() => {
  const match = location.pathname.match(/\/category\/([^/]+)/);
  if (match && match[1]) {
    const categoryName = match[1];
    setFavProducts([]);  // No products to display
    setSelectedProduct(null);
    setShowProductFeed(true)
    setSelectedCategory(categoryName);
    setDisplayCategory(categoryName);
  } else {
    setSelectedCategory(null);
    setDisplayCategory('');
  }
}, [location.pathname]);

  
  const handleSearch = (query) => {
    if (query === '') {
      setProducts(allproducts);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
      );
      setProducts(filtered);
    }
  };


  const handleShowLoginDialog = (query) => {
    if (!email && query.trim() !== '') {
      setShowLoginForm(true); // Show the login form when there is a non-empty query
      setShowProductFeed(false); // Hide the product feed if login form is shown
    } else if (!email && query.trim() === '') {
      setShowLoginForm(false); // Hide the login form if query is empty
      setShowProductFeed(true); // Show the product feed if query is empty
    }
  };
    
  
  const handleChange = ({ target: { name, value, files } }) =>
    setFormData(prev => ({ ...prev, [name]: name === 'image' ? files[0] : value, username, email }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert('Please upload an image.');

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    try {
      await axios.post('https://tuni-market.vercel.app/api/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData({ name: '', price: 0, image: null, location: '', stock: 1, category: '', username: '', email: '' ,description:"",phoneNumber:""});
      setShowForm(false);
      const { data: updatedProducts } = await axios.get('https://tuni-market.vercel.app/api/products');
      setProducts(updatedProducts);
    } catch (error) {
      alert(`Error adding product: ${error.response?.data?.message || error.message}`);
    }
  };


  const handleSubmitOrder = async (paymentOption, additionalDetails) => {
    if (!username) {
      alert("You need to log in to submit an order!");
      return;
    }

    const currentDate = new Date();

    //Bug related : date and time is like this 11/19/2024 18.6 withtout 0 padding instead of 18.06
    const zeroPad = (num) => (num < 10 ? `0${num}` : num);

    const formattedDate = `${currentDate.toLocaleDateString()} ${zeroPad(currentDate.getHours())}:${zeroPad(currentDate.getMinutes())}`;

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const orderDetails = {
      cartItems: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        category: item.product.category,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      email,
      username,
      totalAmount,
      orderDate: formattedDate,
      paymentOption,
      address: additionalDetails.address,
      cardDetails: additionalDetails.cardDetails,
    };

    try {
      await axios.post('https://tuni-market.vercel.app/api/orders', orderDetails);
      setShowCart(false);      
      const doc = new jsPDF();

      // Add logo in the center with increased width
      const logoUrl = 'https://tunimarket.vercel.app/Badge.png';
      doc.addImage(logoUrl, 'PNG', 85, 10, 50, 40); // Increased width from 40 to 50 (you can adjust this further)
      
      // Add title "Order Invoice" at the top-left with a smaller font size
      doc.setFontSize(16); // Reduced font size
      doc.setFont('helvetica', 'bold');
      doc.text('Order Invoice', 20, 25); // Adjust the x, y for top-left position
      
      // Add date on top-right corner
      const currentDate = new Date().toLocaleDateString(); // Format the date as needed
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${currentDate}`, 190, 20, null, null, 'right');
      
      // Order details (centered with a bit more space)
      doc.setFontSize(12); // Smaller font size for the body content
      doc.text(`Username: ${orderDetails.username}`, 105, 70, null, null, 'center');
      doc.text(`Order Date: ${orderDetails.orderDate}`, 105, 80, null, null, 'center');
      doc.text(`Total Amount: ${orderDetails.totalAmount}DT`, 105, 90, null, null, 'center');
      doc.text(`Payment Option: ${orderDetails.paymentOption}`, 105, 100, null, null, 'center');
      doc.text(`Address: ${orderDetails.address}`, 105, 110, null, null, 'center');
      
      // Separator line
      doc.setLineWidth(0.5);
      doc.line(20, 115, 190, 115); // Horizontal line from left to right
      
      // Order items (centered with smaller font size)
      doc.text('Order Items:', 105, 125, null, null, 'center');
      orderDetails.cartItems.forEach((item, index) => {
        const yOffset = 135 + (index * 10);
        doc.text(`${item.name} (x${item.quantity}) - ${item.total}DT`, 105, yOffset, null, null, 'center');
      });
      
      // Add signature image just after the order items
      const signatureUrl = 'https://tunimarket.vercel.app/Signature.png';
      const signatureYPosition = 135 + (orderDetails.cartItems.length * 10) + 10; // Adjust y position based on the number of items
      doc.addImage(signatureUrl, 'PNG', 85, signatureYPosition, 40, 40); // Adjust x, y, width, height for the signature
      
      // Convert PDF to base64 and send it to the server
      const pdfData = doc.output('datauristring'); // This returns the PDF as a base64 string
      
      const userEmail = window.localStorage.getItem('email');
      const subject = "Order Successfully Passed"; 
      const message = " ";
      alert ("Order placed successfully. Check your email for the invoice.")   
      await axios.post('https://tuni-market.vercel.app/api/send-order-email', {
                          email: userEmail,
                          subject: subject,
                          message: message,
                          attachment: pdfData,  // Send the PDF data

      });            
      setCartItems([]); // This will reset the cart to an empty array
      navigate(`/`); 
      window.location.reload();
    } catch (error) {
      alert("Error submitting order: " + error.message);
    }
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setCurrentSelectedProduct(selectedProduct); // Set the global variable to the current value of selectedProduct
    setSelectedProduct(null); 
  }

  const handleLogout = () => {
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('isAdmin');
    window.localStorage.removeItem('email');
    setFavProducts(false)

    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowForm(false);
    setShowCart(false);
    setShowLoginForm(false);
    setShowProductFeed(true)
    setSelectedProduct(null); 

    clearCart();  // This will reset the cart items
    navigate(`/`); 

    };

  const handleAddProductClick = () => {
    if (!isLoggedIn) {
      setShowLoginForm(true);
    } else {
      setShowForm(!showForm);
    }
  };

  const toggleCart = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCart(!showCart);
  };
  

  const handleHomeClick = () => {
    setDisplayCategory(null)
    setFavProducts(false)
    setSelectedProduct(null); 
    setShowProductFeed(true);
    setShowCart(false);
    setShowForm(false);
    setShowLoginForm(false);
    document.title = "Achetez et Vendez en Ligne en Tunisie | Marketplace TuniMarket"; // Set the title dynamically
    navigate(`/`); 
  };

  const Carthide = () => {
    setShowCart(false);
  };

  const handleProductClick = (product) => {
    setShowProductFeed(false);
    setSelectedProduct(product);
    navigate(`/product/${product.id}`); 
  };
  

  const handleFilterProducts = () => {
    const filteredProducts = displayCategory ? products.filter(product => product.category === displayCategory) : products;
    // You can return the filtered products or update some state here as needed
    return filteredProducts;
  };

  const onLoginSuccess = async () => {
    setSelectedProduct(currentSelectedProduct); 

    const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(true);

    setIsAdmin(isAdmin);
    setShowProductFeed(isAdmin ? false : true);
    setShowLoginForm(false);
    const email = window.localStorage.getItem('email');
  
    if (email) {
      try {
        // Fetch the last cart list for the given email
        const { data: cartlastproduct } = await fetchCart(email);
  
        // Extract product IDs from the last cart list
        const lastCartLists = cartlastproduct.map(item => item.productId);
  
        // Fetch all products from the API
        const { data: allProducts } = await axios.get('https://tuni-market.vercel.app/api/products');
  
        // Create a map of product IDs for faster lookup
        const allProductsMap = new Map(allProducts.map(product => [product.id, product]));
  
        // Filter products in the cart and detect invalid ones
        const filteredProducts = cartlastproduct
          .map(cartItem => {
            const product = allProductsMap.get(cartItem.productId);
            return product ? { ...cartItem, product } : null;
          })
          .filter(item => item !== null); // Remove invalid items
  
        // Identify any invalid cart items
        const invalidCartItems = lastCartLists.filter(item => !allProductsMap.has(item));
  
        // Remove invalid cart items
        for (const productId of invalidCartItems) {
          await removeFromCart(productId);
        }
  
        // Map filtered products to the cart format and update cartItems
        filteredProducts.forEach(cartItem => {
          addToCart(cartItem.product, cartItem.quantity); // Add valid product with its quantity
        });
  
        const currentCartItems = cartItems; // Get the cart items directly from context
  
        // Get the productIds from filteredProducts
        const filteredProductIds = filteredProducts.map(item => item.product.id);
  
        // Filter currentCartItems to remove items that have a matching productId in filteredProducts
        const updatedCartItems = currentCartItems.filter(cartItem => 
          !filteredProductIds.includes(cartItem.productId) // Corrected this line
        );
  
        // Add remaining valid products back to the cart
        for (const cartItem of updatedCartItems) {
          await additemnotloggedindatabase(cartItem.product, cartItem.quantity); // Wait for each operation to complete
        }

        //alert("Updated Cart Items: " + JSON.stringify(updatedCartItems, null, 2));
  
      } catch (error) {
        console.error('Error updating cart:', error.response?.data || error.message);
        alert('Failed to restore the cart. Please try again.');
      }

    }

  };
  
  
  const handleFavorite = async () => {
    const userEmail = window.localStorage.getItem('email');
    navigate(`/`); 

    try {
      const { data: favoriteProducts } = await axios.get(`https://tuni-market.vercel.app/api/getfavorites?email=${userEmail}`);
      const favoriteIds = favoriteProducts.map(product => product.id);
      const updatedFavProducts = products.filter(product => favoriteIds.includes(product.id));
      setFavProducts(updatedFavProducts);
      
      if (updatedFavProducts.length===0||!updatedFavProducts) {
        alert("Favorite list is empty");
      } else {
        setSelectedProduct(null);
        setShowProductFeed(true); // Show product feed with the updated favorites
      }
    } catch (error) {
      console.error('Error fetching favorites:', error.response?.data || error.message);
      alert("Error fetching favorites. Please try again later.");
    }
  };
  
  return (
    <div className="container mt-5">
       
     

{!isAdmin && (
      <Navbar 
        categories={categories} 
        displayCategory={displayCategory} 
        setDisplayCategory={setDisplayCategory} 
        onCartClick={toggleCart} 
        onHomeClick={handleHomeClick}
        onFavoriteClick={handleFavorite} // Pass the favorite click handler
        onSearch={handleSearch}
        onShowLoginDialog={handleShowLoginDialog} // Pass down handler for login dialog

      />
      
    )}

{username && (
  <h6 className="text-end">
  {translate('welcome', language)}, {isAdmin ? `admin ${username}` : username}!
        </h6>
      )}

      
<div className="d-flex mt-1">
      {/* Conditionally render the Add Product button for non-admin users */}
      {!isAdmin && (
        <button className="btn btn-primary" onClick={handleAddProductClick}
        aria-label="Add Product" // Add this line for accessibility

        >
          {showForm ? <span style={{ fontFamily: 'arial', fontSize: '16px'}}>__</span> : <><FaPlus /></>}
        </button>
      )}
        <button
          className={`btn ms-3 ${isLoggedIn ? 'btn-danger' : 'btn-secondary'}`}
          onClick={isLoggedIn ? handleLogout : handleLoginClick}
          aria-label={isLoggedIn ? "Logout" : "Login"}

        >
          {isLoggedIn ? <FaSignOutAlt /> : <FaSignInAlt />}
        </button>
      </div>

      {showForm && <AddProductForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} categories={categories} />}
      
      {showLoginForm ? (
      <LoginForm onLoginSuccess={onLoginSuccess} />
    ) : (
      showProductFeed && !location.pathname.includes('product') && (
        <ProductFeed 
          filteredProducts={favProducts.length > 0 ? favProducts : handleFilterProducts()}  
          handleProductClick={handleProductClick} 
        />
      )
    )
    }

      {showCart && <Cart Carthide={Carthide} handleSubmitOrder={handleSubmitOrder} />}
      {selectedProduct && <ProductDetail product={selectedProduct} />}

      {isAdmin && (
  <iframe
    src="https://app.powerbi.com/view?r=eyJrIjoiMTg2NjIxYTYtNGNlMi00OTYxLWJmNDgtNWEwNTlhZmU1Y2Q4IiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9"
    width="100%" 
    height="1000px" 
    frameBorder="0" 
    allowFullScreen="true" 
    title="PowerBI Dashboard"
  />
)}


    </div>

  );
}

export default App;
