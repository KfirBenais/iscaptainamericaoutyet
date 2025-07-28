import React, { useState } from 'react';
import { sendOrderEmail } from './emailService';

const Checkout = ({ cart, onClose, onOrderComplete }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleInputChange = (field, value) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  const isFormValid = () => {
    return customerData.name.trim() && customerData.email.trim() && customerData.phone.trim();
  };

  const handleSubmitOrder = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare order data
    const orderData = {
      customer: customerData,
      items: cart,
      total: getCartTotal(),
      orderDate: new Date().toLocaleString(),
      orderId: 'ORD-' + Date.now()
    };

    try {
      console.log('Order Data:', orderData);
      
      // Show payment QR code first
      setShowPaymentQR(true);
      
      // Send order email
      await sendOrderEmail(orderData);
      console.log('Order email sent successfully');
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Order placed but email notification failed. We will process your order manually.');
      // Still show payment QR even if email fails
      setShowPaymentQR(true);
    }
  };

  const handlePaymentComplete = () => {
    onOrderComplete();
    setShowPaymentQR(false);
  };

  if (showPaymentQR) {
    return (
      <div className="modal-overlay">
        <div className="payment-modal">
          <h2>Complete Your Payment</h2>
          <div className="payment-info">
            <p><strong>Order ID:</strong> ORD-{Date.now()}</p>
            <p><strong>Total Amount:</strong> {getCartTotal()} ₪</p>
          </div>
          
          <div className="qr-code-section">
            <div className="qr-code-placeholder">
              <p>📱 QR Code for Payment</p>
              <div className="qr-code">
                <img 
                  src="./Images/BitQrCode.jpeg" 
                  alt="Payment QR Code" 
                  className="qr-code-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="qr-code-fallback" style={{display: 'none'}}>
                  <p>QR Code temporarily unavailable</p>
                  <p>Please contact us for payment instructions</p>
                </div>
              </div>
              <p>Scan with your BIT app to pay {getCartTotal()} ₪</p>
            </div>
          </div>
          
          <div className="payment-instructions">
            <h4>Payment Instructions:</h4>
            <ol>
              <li>Open your BIT app</li>
              <li>Scan the QR code above</li>
              <li>Confirm the payment amount</li>
              <li>Complete the transaction</li>
            </ol>
          </div>
          
          <div className="payment-actions">
            <button className="payment-complete-btn" onClick={handlePaymentComplete}>
              ✅ Payment Completed
            </button>
            <button className="payment-cancel-btn" onClick={() => setShowPaymentQR(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Checkout</h2>
        
        <div className="checkout-content">
          <div className="customer-form">
            <h3>Your Information</h3>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-details">
                      Qty: {item.quantity} | Colors: {item.colors.join(', ')}
                    </span>
                    {item.notes && (
                      <span className="item-notes">Notes: {item.notes}</span>
                    )}
                  </div>
                  <span className="item-total">{item.totalPrice} ₪</span>
                </div>
              ))}
            </div>
            
            <div className="summary-total">
              <strong>Total: {getCartTotal()} ₪</strong>
            </div>
          </div>
        </div>
        
        <div className="checkout-footer">
          <button className="back-to-cart-btn" onClick={onClose}>
            Back to Cart
          </button>
          <button 
            className={`submit-order-btn ${!isFormValid() ? 'disabled' : ''}`}
            onClick={handleSubmitOrder}
            disabled={!isFormValid()}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
