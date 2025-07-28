import React, { useState } from 'react';

const AddToCartModal = ({ product, onAdd, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColors, setSelectedColors] = useState([]);
  const [notes, setNotes] = useState('');

  const availableColors = [
    'White', 'Black', 'Rainbow', 'Red', 'Blue', 'Beige', 
    'Red/Blue Mix', 'Yellow', 'Transparent', 'Green', 
    'Bronze', 'Purple', 'Titanium Gray Carbon Fiber', 'Green/Red/Blue Mix'
  ];

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSubmit = () => {
    if (selectedColors.length === 0) {
      alert('Please select at least one color');
      return;
    }
    onAdd(product, quantity, selectedColors, notes);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="add-to-cart-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="add-to-cart-header">
          <img src={product.image} alt={product.name} className="add-to-cart-image" />
          <div className="add-to-cart-info">
            <h3>{product.name}</h3>
            <p className="price">{product.price} ₪ each</p>
          </div>
        </div>

        <div className="add-to-cart-body">
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="color-section">
            <label>Select Colors:</label>
            <div className="color-grid">
              {availableColors.map(color => (
                <div 
                  key={color}
                  className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
                  onClick={() => toggleColor(color)}
                >
                  {color}
                </div>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <label>Special Notes (color settings, preferences, etc.):</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions about colors, size preferences, or other customizations..."
              rows={4}
            />
          </div>

          <div className="total-section">
            <p className="total">Total: {(product.price * quantity).toFixed(0)} ₪</p>
          </div>

          <button className="add-to-cart-submit" onClick={handleSubmit}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
