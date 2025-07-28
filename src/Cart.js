import React from 'react';

const Cart = ({ cart, onClose, onRemove, onUpdateQuantity, onCheckout }) => {
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="cart-modal">
          <button className="modal-close" onClick={onClose}>✕</button>
          <h2>Your Cart</h2>
          <div className="empty-cart">
            <p>🛒 Your cart is empty</p>
            <button className="continue-shopping" onClick={onClose}>
              Continue Shopping
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
        <h2>Your Cart ({cart.length} items)</h2>
        
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
              
              <div className="cart-item-details">
                <h4>{item.product.name}</h4>
                <p className="cart-item-price">{item.product.price} ₪ each</p>
                
                <div className="cart-item-colors">
                  <strong>Colors: </strong>
                  {item.colors.join(', ')}
                </div>
                
                {item.notes && (
                  <div className="cart-item-notes">
                    <strong>Notes: </strong>
                    {item.notes}
                  </div>
                )}
                
                <div className="cart-item-quantity">
                  <label>Quantity: </label>
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
                  <strong>Subtotal: {item.totalPrice} ₪</strong>
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
            <h3>Total: {getCartTotal()} ₪</h3>
          </div>
          
          <div className="cart-actions">
            <button className="continue-shopping" onClick={onClose}>
              Continue Shopping
            </button>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
