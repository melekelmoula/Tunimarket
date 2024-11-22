// my-react-app\src\components\Navbar.js
import React, { useState } from 'react'; // Import React and the useState hook
import { FaShoppingCart, FaHome, FaHeart } from 'react-icons/fa'; // Importing icons for cart, home, and favorite
import { useCart } from '../contexts/CartContext'; // Importing context to access cart data
import { useLanguage, translate } from '../contexts/LanguageContext';  // Import translate
import Flag from 'react-world-flags';
import './Navbar.css';

// Navbar component function
function Navbar({ categories, displayCategory, setDisplayCategory, onCartClick, onHomeClick, onFavoriteClick, onSearch }) {
  const { cartItemCount } = useCart(); // Using the cart context to get the number of items in the cart
  const [searchQuery, setSearchQuery] = useState(''); // State for managing search input
  const { language, switchLanguage } = useLanguage(); // Use language from context

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value; // Get the value from the input field
    setSearchQuery(query); // Update the searchQuery state
    onSearch(query); // Call the parent component's search handler
  };

  // Get the email from local storage (to check if user is logged in)
  const email = window.localStorage.getItem('email');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light"> {/* Navbar container */}
      <div className="container-fluid">
        {/* Hamburger icon for mobile screens */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* List of navigation items */}
          <ul className="navbar-nav">
            {/* Home button */}
            <li className="nav-item ms-3">
            <button className="nav-link" onClick={onHomeClick}>
                <FaHome /> 
              </button>
            </li>

            {/* Loop through categories and create buttons */}
            {categories.map((cat) => (
              <li className="nav-item" key={cat.id}>
                <button
                  className={`nav-link ${displayCategory === cat.name ? 'active' : ''}`} // Add active class if the category is selected
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    // Toggle category display on click
                    setDisplayCategory(displayCategory === cat.name ? '' : cat.name);
                  }}
                >
                  {/* Translate category names dynamically */}
                  {translate(cat.name, language)} {/* Translate category name */}
                </button>
              </li>
            ))}

            {/* Cart button */}
            <li className="nav-item ms-auto">
              <button className="nav-link" onClick={onCartClick}>
                <FaShoppingCart /> {/* Shopping cart icon */}
                <span className="badge bg-danger">{cartItemCount}</span> {/* Display the number of items in the cart */}
              </button>
            </li>
            
            {/* Conditionally render the favorite button if user is logged in (email exists) */}
            {email && (
              <li className="nav-item ms-3">
                <button className="nav-link" onClick={onFavoriteClick}> {/* On click, show user's favorite items */}
                  <FaHeart /> {/* Heart icon for favorites */}
                </button>
              </li>
            )}
          </ul>

          {/* Search bar */}
          <form className="d-flex ms-auto">
            <input
              type="text"
              className="form-control"
              placeholder= {translate('Search',language)} // Placeholder text in the search bar
              value={searchQuery} // Controlled input, using searchQuery state
              onChange={handleSearchChange} // Update the searchQuery state when user types
            />
          </form>
          <span>


  <button 
    onClick={() => switchLanguage(language === 'en' ? 'fr' : 'en')}
    className="red-background"
  >
    <Flag code={language === 'en' ? 'FR' : 'GB'} alt="language flag" width="24" height="16" />
  </button>
</span>

          
        </div>
      </div>
    </nav>
  );
}

// Export the Navbar component to use it in other parts of the app
export default Navbar;
