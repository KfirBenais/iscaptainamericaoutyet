import React from 'react';
import { useLanguage, getColorLabel } from './i18n';

const Cart = ({ cart, onClose, onRemove, onUpdateQuantity, onCheckout }) => {
  const { language, t } = useLanguage();
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="cart-modal">
          <button className="modal-close" onClick={onClose}>✕</button>
          <h2>{t('cart.title')}</h2>
          <div className="empty-cart">
            <p>{t('cart.empty')}</p>
            <button className="continue-shopping" onClick={onClose}>
              {t('buttons.continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cart-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>
          {t('cart.title')} ({cart.length} {cart.length === 1 ? t('cart.itemLabelSingular') : t('cart.itemLabelPlural')})
        </h2>
        
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
              
              <div className="cart-item-details">
                <h4>{item.product.name}</h4>
                <p className="cart-item-price">{item.product.price} ₪ {t('cart.each')}</p>
                
                <div className="cart-item-colors">
                  <strong>{t('cart.colors')}: </strong>
                  {item.colors.map(color => getColorLabel(color, language)).join(', ')}
                </div>
                
                {item.notes && (
                  <div className="cart-item-notes">
                    <strong>{t('cart.notes')}: </strong>
                    {item.notes}
                  </div>
                )}
                
                <div className="cart-item-quantity">
                  <label>{t('cart.quantity')}: </label>
                  <div className="quantity-controls">
                    <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  <strong>{t('cart.subtotal')}: {item.totalPrice} ₪</strong>
                </div>
              </div>
              
              <button 
                className="remove-item-btn"
                onClick={() => onRemove(item.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-footer">
          <div className="cart-total">
            <h3>{t('cart.total')}: {getCartTotal()} ₪</h3>
          </div>
          
          <div className="cart-actions">
            <button className="continue-shopping" onClick={onClose}>
              {t('buttons.continueShopping')}
            </button>
            <button className="checkout-btn" onClick={onCheckout}>
              {t('buttons.proceedToCheckout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
