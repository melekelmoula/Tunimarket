// my-react-app\src\components\AddProductForm.js
import React, { Component } from 'react';

class AddProductForm extends Component {
  render() {
    const { formData, handleChange, handleSubmit, categories } = this.props;

    return (
      <div className="card p-4 mb-4">
        <h2 className="text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="mt-3">
          {['name', 'price', 'location', 'stock', 'image'].map((field) => (
            <div className="form-group mt-3" key={field}>
              <input
                type={field === 'price' || field === 'stock' ? 'number' : field === 'image' ? 'file' : 'text'}
                className="form-control"
                placeholder={`Product ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                name={field}
                value={field !== 'image' ? formData[field] : undefined}
                onChange={handleChange}
                min={field === 'price' ? 0 : 1}
                required
              />
            </div>
          ))}
          <select className="form-control mt-3" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-success w-100 mt-4">Add Product</button>
        </form>
      </div>
    );
  }
}

export default AddProductForm;
