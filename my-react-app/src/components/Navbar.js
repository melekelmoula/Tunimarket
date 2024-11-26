// Import necessary libraries and components
import React, { useState } from 'react'; 
import { FaShoppingCart, FaHome, FaHeart } from 'react-icons/fa'; 
import { useCart } from '../contexts/CartContext'; // Cart context to manage cart data
import { useLanguage, translate } from '../contexts/LanguageContext'; // Language context for translations
import Flag from 'react-world-flags'; // For showing language flags
import './Navbar.css'; // Import CSS for styling

// Navbar component that accepts props for various functionality
function Navbar({
  categories, // List of product categories
  displayCategory, // Currently displayed category
  setDisplayCategory, // Function to update the displayed category
  onCartClick, // Handler for cart button click
  onHomeClick, // Handler for home button click
  onFavoriteClick, // Handler for favorite button click
  onSearch, // Handler for search input change
}) {
  const { cartItemCount } = useCart(); // Get the number of items in the cart from context
  const [searchQuery, setSearchQuery] = useState(''); // State for managing search input
  const { language, switchLanguage } = useLanguage(); // Get current language and function to switch language

  // Function to handle changes in the search input field
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the search query state
    onSearch(query); // Pass the search query to the parent component
  };

  // Check if the user is logged in by retrieving their email from local storage
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
    className="Flag-background"
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
