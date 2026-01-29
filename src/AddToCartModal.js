import React, { useState } from 'react';
import { useLanguage, getColorLabel } from './i18n';

const AddToCartModal = ({ product, onAdd, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColors, setSelectedColors] = useState([]);
  const [notes, setNotes] = useState('');
  const { language, t } = useLanguage();

  const availableColors = [
    'White', 'Black', 'Rainbow (Surprise!)', 'Red', 'Blue', 'Beige (Skin tone)', 
    'Yellow', 'Transparent', 'Green', 'Bronze', 'Purple', 'Gray', 'Green/Red/Blue Mix',
    'White Marble', 'Glow Glitter Green', 'Galaxy', 'Orange TPU', 'Black TPU', 'WOOD'
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
      alert(t('addToCart.selectColorAlert'));
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
            <p className="price">{product.price} ₪ {t('addToCart.priceEachSuffix')}</p>
          </div>
        </div>

        <div className="add-to-cart-body">
          <div className="quantity-section">
            <label>{t('addToCart.quantity')}</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="color-section">
            <label>{t('addToCart.selectColors')}</label>
            <div className="color-grid">
              {availableColors.map(color => (
                <div 
                  key={color}
                  className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
                  onClick={() => toggleColor(color)}
                >
                  {getColorLabel(color, language)}
                </div>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <label>{t('addToCart.notesLabel')}</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('addToCart.notesPlaceholder')}
              rows={4}
            />
          </div>

          <div className="total-section">
            <p className="total">{t('addToCart.total')} {(product.price * quantity).toFixed(0)} ₪</p>
          </div>

          <button className="add-to-cart-submit" onClick={handleSubmit}>
            {t('buttons.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
