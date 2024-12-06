import React from 'react'; 
import { useLanguage, translate } from '../contexts/LanguageContext'; // Importing language context and translation function

// The AddProductForm component receives formData, handleChange, handleSubmit, and categories as props.
const AddProductForm = ({ formData, handleChange, handleSubmit, categories }) => {
  const { language } = useLanguage(); // Use the hook to get the current language from context

  return (
    <div className="card p-4 mb-4"> {/* Card container for the form */}
      <h2 className="text-center">{translate('addProduct', language)}</h2> {/* Translated heading */}
      
      <form onSubmit={handleSubmit} className="mt-3"> {/* Form with submission handler */}
        
        {/* Product Name Input */}
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder={translate('productName', language)} // Translated placeholder text
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Description Input */}
<div className="form-group mt-3">
  <textarea
    className="form-control"
    placeholder={translate('productDescription', language)} // Translated placeholder text
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows="2" // Specifies the height of the textarea
    required
    style={{
      resize: 'vertical', // Allow vertical resizing only
      fontSize: '16px',
      padding: '10px',
    }}
  />
</div>

        {/* Product Price Input */}
        <div className="form-group mt-3">
          <input
            type="number"
            className="form-control"
            placeholder={translate('enterPrice', language)} // Translated placeholder text
            name="price"
            onChange={handleChange}
            min="0"
            required
            style={{
              width: '100%', // Full width of the input
              fontSize: '16px',
              textAlign: 'left',
              padding: '10px',
            }}
          />
        </div>

        {/* Product Location Input */}
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder={translate('enterLocation', language)} // Translated placeholder text
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Stock Input */}
        <div className="form-group mt-3">
          <input
            type="number"
            className="form-control"
            placeholder={translate('enterStock', language)} // Translated placeholder text
            name="stock"
            onChange={handleChange}
            min="1"
            required
            style={{
              width: '100%', // Full width of the input
              fontSize: '16px',
              textAlign: 'left',
              padding: '10px',
            }}
          />
        </div>

        {/* Phone Number Input */}
<div className="form-group mt-3">
  <input
    type="tel"
    className="form-control"
    placeholder={translate('enterPhoneNumber', language)} // Translated placeholder text
    name="phoneNumber"
    value={formData.phoneNumber}
    onChange={handleChange}
    pattern="[0-9]{8}" // Regex to enforce exactly 8 digits
    maxLength="8" // Restrict input to 8 characters
    required
  />
</div>


        {/* Product Image Input */}
        <div className="form-group mt-3">
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleChange}
            required
          />
        </div>

        {/* Category Selection and Submit Button */}
        <span className="form-group mt-3" style={{ display: 'flex', alignItems: 'center' }}>
          <select
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ marginRight: '10px' }}  // Add some space between select and button
          >
            <option value="">{translate('selectCategory', language)}</option> {/* Default option */}
            
            {/* Mapping categories to options */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {translate(cat.name, language)} {/* Translate category name */}
              </option>
            ))}
          </select>
          
          {/* Submit Button */}
          <button 
            type="submit"
            style={{
              fontSize: '50px',  // Large plus sign
              background: 'transparent',
              color: 'black',  // Black text color
              width: '9%',  // Adjust width of button
              padding: '1px',  // Add padding as desired
            }}
          >
            +
          </button>
        </span>

      </form>
    </div>
  );
}

export default AddProductForm;
