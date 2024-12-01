import React, { useState } from 'react'; 
import { FaShoppingCart, FaHome, FaHeart } from 'react-icons/fa'; 
import { useCart } from '../contexts/CartContext'; 
import { useLanguage, translate } from '../contexts/LanguageContext'; 
import './Navbar.css'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

function Navbar({
  categories, 
  displayCategory, 
  setDisplayCategory, 
  onCartClick, 
  onHomeClick, 
  onFavoriteClick, 
  onSearch,
  onShowLoginDialog // New prop to handle showing login dialog
}) {
  const navigate = useNavigate(); // Initialize the navigate function

  const { cartItemCount } = useCart(); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const { language, switchLanguage } = useLanguage(); 
  const email = window.localStorage.getItem('email');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the search query state
  
    // If user is not logged in and query is not empty, trigger the login dialog
    if (!email && query.trim() !== '') {
      onShowLoginDialog(query); // Pass the search query to the login dialog
    } else if (!email && query.trim() === '') {
      // If user is not logged in and the query is empty, show product feed
      onShowLoginDialog(''); // Clear the login form when the query is empty
    } else {
      // If user is logged in or query is empty, perform the search
      onSearch(query); // Pass the search query to the parent component
    }
  };
  
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item ms-3">
              <button className="nav-link" onClick={onHomeClick}
                  aria-label="Go to Home Page" // Add this line for accessibility

    >
                <FaHome /> 
              </button>
            </li>

              {categories.map((cat) => (
  <li className="nav-item" key={cat.id}>
    <button
      className={`nav-link ${displayCategory === cat.name ? 'active' : ''}`}
      onClick={() => {
        setDisplayCategory(displayCategory );
        navigate(`/category/${cat.name}`);
      }}
    >
      {translate(cat.name, language)}
    </button>
  </li>
))}

            <li className="nav-item ms-auto">
              <button className="nav-link" onClick={onCartClick}>
                <FaShoppingCart /> 
                <span className="badge bg-danger">{cartItemCount}</span> 
              </button>
            </li>

            {email && (
              <li className="nav-item ms-3">
                <button className="nav-link" onClick={onFavoriteClick}> 
                  <FaHeart />
                </button>
              </li>
            )}
          </ul>

          <img 
          src="https://tunimarket.vercel.app/Badge.png" 
          alt="Logo" 
          className="logo" 
          />
            
          <form className="d-flex ms-auto">
            <input
              type="text"
              className="form-control"
              placeholder={translate('Search', language) }
              value={searchQuery} 
              onChange={handleSearchChange} 
            />
          </form>
          <br></br>
          <br></br>
          <br></br>

          <span>
  <label htmlFor="language-select" className="sr-only">Lang</label>
  <select
    id="language-select"
    value={language}
    onChange={(e) => switchLanguage(e.target.value)}
    className="form-select"
    aria-label="Language" // Accessible label for screen readers
  >
    <option value="en">English</option>
    <option value="fr">Francais</option>
  </select>
</span>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
