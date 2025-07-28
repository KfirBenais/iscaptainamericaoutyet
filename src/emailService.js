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
        const isLocalhost = window.location.hostname === 'localhost';
        
        let imageUrl;
        if (isLocalhost) {
          // Development: Use placeholder with product initials
          imageUrl = `https://via.placeholder.com/64x64/4CAF50/white?text=${encodeURIComponent(item.product.name.slice(0,2))}`;
        } else {
          // Production: Use real images - they work at /Images/ path!
          const imageName = item.product.image.split('/').pop();
          imageUrl = `${window.location.origin}/Images/${imageName}`;
        }
        
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

    // Send email to customer
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.customerTemplateId,
      templateParams
    );

    return response;
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
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
    if (ownerResult.status === 'rejected') {
      console.error('Owner notification failed:', ownerResult.reason);
    }

    if (customerResult.status === 'rejected') {
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
 * Test if product images are accessible (production-safe version)
 */
export const testImageUrls = () => {
  const results = [];
  results.push('=== IMAGE URL DEBUGGING ===');
  results.push(`Current origin: ${window.location.origin}`);
  results.push(`Current hostname: ${window.location.hostname}`);
  results.push(`Is localhost: ${window.location.hostname === 'localhost'}`);
  
  // Test a few sample products
  const sampleProducts = [
    { name: "Supermarket CartCoin", image: "./Images/SuperMarketCoin.jpg" },
    { name: "Hamsa", image: "./Images/Hamsa.jpg" },
    { name: "Heart KeyChain", image: "./Images/HeartKeyChain.jpg" }
  ];
  
  sampleProducts.forEach(product => {
    const imageName = product.image.split('/').pop();
    const imageUrl = `${window.location.origin}/Images/${imageName}`;
    const publicImageUrl = `${window.location.origin}/public/Images/${imageName}`;
    
    results.push(`\n--- ${product.name} ---`);
    results.push(`Original path: ${product.image}`);
    results.push(`Image name: ${imageName}`);
    results.push(`URL 1: ${imageUrl}`);
    results.push(`URL 2: ${publicImageUrl}`);
    
    // Test both URLs
    [imageUrl, publicImageUrl].forEach((url, index) => {
      const img = new Image();
      img.onload = () => {
        results.push(`✅ URL ${index + 1} loads successfully: ${url}`);
        // eslint-disable-next-line no-console
        console.log(`✅ URL ${index + 1} loads successfully: ${url}`);
      };
      img.onerror = () => {
        results.push(`❌ URL ${index + 1} failed to load: ${url}`);
        // eslint-disable-next-line no-console
        console.log(`❌ URL ${index + 1} failed to load: ${url}`);
      };
      img.src = url;
    });
  });
  
  // eslint-disable-next-line no-console
  console.log(results.join('\n'));
  return results;
};

/**
 * Test email image compatibility (production-safe version)
 */
export const testEmailImageCompatibility = async () => {
  const results = [];
  results.push('=== EMAIL IMAGE COMPATIBILITY TEST ===');
  
  // Test different image hosting approaches
  const testUrls = [
    `${window.location.origin}/Images/Hamsa.jpg`,
    `${window.location.origin}/public/Images/Hamsa.jpg`,
    'https://via.placeholder.com/64x64/f0f0f0/666?text=Test',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=64&h=64&fit=crop' // Public CDN test
  ];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url);
      const message = `${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`;
      results.push(message);
      // eslint-disable-next-line no-console
      console.log(message);
    } catch (error) {
      const message = `❌ ${url} - Error: ${error.message}`;
      results.push(message);
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }
  
  return results;
};

// Make test functions available globally
if (typeof window !== 'undefined') {
  window.testImageUrls = testImageUrls;
  window.testEmailImageCompatibility = testEmailImageCompatibility;
}

const emailService = { sendOrderEmail, sendOwnerNotification, sendCustomerConfirmation };
export default emailService;
