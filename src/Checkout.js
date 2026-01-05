import React, { useState } from 'react';
import { sendOrderEmail } from './emailService';
import { useLanguage, getColorLabel } from './i18n';

const Checkout = ({ cart, onClose, onOrderComplete }) => {
  const { language, t, dictionary } = useLanguage();
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const paymentSteps = dictionary?.checkout?.payment?.steps ?? [];

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
      alert(t('alerts.checkoutMissingFields'));
      return;
    }

    // Show payment QR code - don't send email yet
    setShowPaymentQR(true);
  };

  const handlePaymentComplete = async () => {
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
      
      // Send order email only after payment is confirmed
      await sendOrderEmail(orderData);
      console.log('Order email sent successfully');
      
      onOrderComplete();
      setShowPaymentQR(false);
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Payment confirmed but email notification failed. We will process your order manually.');
      // Still complete the order even if email fails
      onOrderComplete();
      setShowPaymentQR(false);
    }
  };

  if (showPaymentQR) {
    return (
      <div className="modal-overlay">
        <div className="payment-modal">
          <h2>{t('checkout.payment.title')}</h2>
          <div className="payment-info">
            <p><strong>{t('checkout.payment.orderId')}:</strong> ORD-{Date.now()}</p>
            <p><strong>{t('checkout.payment.totalAmount')}:</strong> {getCartTotal()} ₪</p>
          </div>
          
          <div className="qr-code-section">
            <div className="qr-code-placeholder">
              <p>{t('checkout.payment.qrPlaceholder')}</p>
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
                  <p>{t('checkout.payment.qrUnavailable')}</p>
                  <p>{t('checkout.payment.qrContact')}</p>
                </div>
              </div>
              <p>{t('checkout.payment.scanInstructionPrefix')} {getCartTotal()} ₪</p>
            </div>
          </div>
          
          <div className="payment-instructions">
            <h4>{t('checkout.payment.instructionsTitle')}</h4>
            <ol>
              {paymentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="payment-actions">
            <button className="payment-complete-btn" onClick={handlePaymentComplete}>
              {t('buttons.paymentDone')}
            </button>
            <button className="payment-cancel-btn" onClick={() => setShowPaymentQR(false)}>
              {t('buttons.paymentCancel')}
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
        <h2>{t('checkout.title')}</h2>
        
        <div className="checkout-content">
          <div className="customer-form">
            <h3>{t('checkout.customerInfoTitle')}</h3>
            
            <div className="form-group">
              <label>{t('checkout.fields.name.label')}</label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('checkout.fields.name.placeholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t('checkout.fields.email.label')}</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('checkout.fields.email.placeholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t('checkout.fields.phone.label')}</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t('checkout.fields.phone.placeholder')}
                required
              />
            </div>
          </div>
          
          <div className="order-summary">
            <h3>{t('checkout.orderSummaryTitle')}</h3>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-details">
                      {t('checkout.quantityLabel')}: {item.quantity} | {t('checkout.colorsLabel')}: {item.colors.map(color => getColorLabel(color, language)).join(', ')}
                    </span>
                    {item.notes && (
                      <span className="item-notes">{t('checkout.notesLabel')}: {item.notes}</span>
                    )}
                  </div>
                  <span className="item-total">{item.totalPrice} ₪</span>
                </div>
              ))}
            </div>
            
            <div className="summary-total">
              <strong>{t('checkout.total')}: {getCartTotal()} ₪</strong>
            </div>
          </div>
        </div>
        
        <div className="checkout-footer">
          <button className="back-to-cart-btn" onClick={onClose}>
            {t('buttons.backToCart')}
          </button>
          <button 
            className={`submit-order-btn ${!isFormValid() ? 'disabled' : ''}`}
            onClick={handleSubmitOrder}
            disabled={!isFormValid()}
          >
            {t('buttons.placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
