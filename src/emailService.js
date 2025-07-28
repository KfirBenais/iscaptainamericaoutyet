import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_mvorj74', // Your EmailJS service ID
  ownerTemplateId: 'template_ovjxldq', // Template for business owner notifications
  customerTemplateId: 'template_coiojip', // Template for customer confirmations (create this next)
  publicKey: 'wpsMuZqOmm54X11l2' // Your EmailJS public key
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

/**
 * Send order notification email to business owner
 * @param {Object} orderData - The order data to send
 * @returns {Promise} - EmailJS send promise
 */
export const sendOwnerNotification = async (orderData) => {
  try {
    // Format the order items for email
    const formattedItems = orderData.items.map(item => 
      `${item.product.name} - Qty: ${item.quantity} - Colors: ${item.colors.join(', ')} - Price: ${item.totalPrice} ₪${item.notes ? ` (Notes: ${item.notes})` : ''}`
    ).join('\n');

    // Prepare template parameters
    const templateParams = {
      order_id: orderData.orderId,
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      order_items: formattedItems,
      total_amount: orderData.total,
      order_date: orderData.orderDate,
      items_count: orderData.items.length,
      to_email: 'kfir_benais@hotmail.com' // Your email address
    };

    // Send email to business owner
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.ownerTemplateId,
      templateParams
    );

    console.log('Owner notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending owner notification:', error);
    throw error;
  }
};

/**
 * Send order confirmation email to customer
 * @param {Object} orderData - The order data to send
 * @returns {Promise} - EmailJS send promise
 */
export const sendCustomerConfirmation = async (orderData) => {
  try {
    console.log('Attempting to send customer confirmation email...');
    console.log('Customer email:', orderData.customer.email);
    console.log('Using template ID:', EMAILJS_CONFIG.customerTemplateId);
    
    // Prepare template parameters for customer confirmation
    const templateParams = {
      order_id: orderData.orderId,
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      email: orderData.customer.email, // Add this - some templates expect 'email'
      to_name: orderData.customer.name, // Add recipient name
      to_email: orderData.customer.email, // Keep this as backup
      total_amount: orderData.total,
      order_date: orderData.orderDate,
      items_count: orderData.items.length,
      website_link: window.location.origin,
      // Format items for the beautiful template
      orders: orderData.items.map(item => {
        // For development, use a placeholder service, for production use actual domain
        const isLocalhost = window.location.hostname === 'localhost';
        const imageUrl = isLocalhost 
          ? `https://via.placeholder.com/64x64/f0f0f0/666?text=${encodeURIComponent(item.product.name.slice(0,3))}` // Placeholder for development
          : `${window.location.origin}/Images/${item.product.image.split('/').pop()}`; // Real images for production
        
        console.log('Product:', item.product.name, 'Image URL:', imageUrl, 'Is localhost:', isLocalhost);
        return {
          name: `${item.product.name} (${item.colors.join(', ')})`,
          units: item.quantity,
          price: item.totalPrice,
          image_url: imageUrl,
          notes: item.notes || ''
        };
      }),
      cost: {
        shipping: 0, // Free shipping for 3D prints
        tax: 0, // No tax shown separately
        total: orderData.total
      }
    };

    console.log('Template parameters:', templateParams);

    // Send email to customer
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.customerTemplateId,
      templateParams
    );

    console.log('Customer confirmation sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
    console.error('Error details:', error.text || error.message);
    throw error;
  }
};

/**
 * Send both owner notification and customer confirmation
 * @param {Object} orderData - The order data to send
 * @returns {Promise} - Both email promises
 */
export const sendOrderEmail = async (orderData) => {
  try {
    // Send both emails simultaneously
    const [ownerResult, customerResult] = await Promise.allSettled([
      sendOwnerNotification(orderData),
      sendCustomerConfirmation(orderData)
    ]);

    // Check results
    if (ownerResult.status === 'fulfilled') {
      console.log('Owner notification sent successfully');
    } else {
      console.error('Owner notification failed:', ownerResult.reason);
    }

    if (customerResult.status === 'fulfilled') {
      console.log('Customer confirmation sent successfully');
    } else {
      console.error('Customer confirmation failed:', customerResult.reason);
    }

    // Return success if at least one email was sent
    if (ownerResult.status === 'fulfilled' || customerResult.status === 'fulfilled') {
      return { owner: ownerResult, customer: customerResult };
    } else {
      throw new Error('Both emails failed to send');
    }
  } catch (error) {
    console.error('Error sending order emails:', error);
    throw error;
  }
};

/**
 * Test if product images are accessible
 */
export const testImageUrls = () => {
  console.log('Testing image URLs...');
  console.log('Origin:', window.location.origin);
  
  // Test a few sample products
  const sampleProducts = [
    { name: "Supermarket CartCoin", image: "./Images/SuperMarketCoin.jpg" },
    { name: "Hamsa", image: "./Images/Hamsa.jpg" },
    { name: "Heart KeyChain", image: "./Images/HeartKeyChain.jpg" }
  ];
  
  sampleProducts.forEach(product => {
    const imageUrl = `${window.location.origin}/Images/${product.image.split('/').pop()}`;
    console.log(`Product: ${product.name}`);
    console.log(`Original path: ${product.image}`);
    console.log(`Generated URL: ${imageUrl}`);
    
    // Test if image loads
    const img = new Image();
    img.onload = () => console.log(`✅ ${product.name} image loads successfully`);
    img.onerror = () => console.log(`❌ ${product.name} image failed to load`);
    img.src = imageUrl;
  });
};

// Make test function available globally
if (typeof window !== 'undefined') {
  window.testImageUrls = testImageUrls;
}
