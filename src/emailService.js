import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_mvorj74', // Your EmailJS service ID
  ownerTemplateId: 'template_ovjxldq', // Template for business owner notifications
  customerTemplateId: 'template_coiojip', // Template for customer confirmations
  // Reuses the owner template — create a dedicated "print_request" template in EmailJS
  // and replace this ID if you want a different email layout for print requests.
  printRequestTemplateId: 'template_ovjxldq',
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
          // Production: Use real images with email-friendly approach
          const imageName = item.product.image.split('/').pop();
          // Use absolute URL for better email client compatibility
          imageUrl = `https://benais3dprints.netlify.app/Images/${imageName}`;
        }
        
        return {
          name: `${item.product.name} (${item.colors.join(', ')})`,
          units: item.quantity,
          price: item.totalPrice,
          image_url: imageUrl,
          notes: item.notes || '',
          // Add fallback text for email clients that block images
          image_alt: item.product.name,
          product_code: item.product.name.slice(0,2).toUpperCase()
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
 * Send a print-request (custom model) notification to the business owner.
 * The actual 3D file is stored in the Netlify Forms dashboard;
 * this email carries all the text details so you get an instant alert.
 * @param {Object} requestData
 */
export const sendPrintRequestNotification = async (requestData) => {
  try {
    const colorList  = requestData.colors.join(', ');
    const orderItems =
      `File: ${requestData.fileName} (${requestData.fileSize})\n` +
      `Download: ${requestData.fileUrl}\n` +
      `Colors: ${colorList}\n` +
      `Quantity: ${requestData.quantity}\n` +
      `Notes: ${requestData.notes || '—'}`;

    const templateParams = {
      order_id:       requestData.requestId,
      customer_name:  requestData.customer.name,
      customer_email: requestData.customer.email,
      customer_phone: requestData.customer.phone,
      order_items:    orderItems,
      total_amount:   'TBD — pending price quote',
      order_date:     requestData.requestDate,
      items_count:    1,
      to_email:       'kfir_benais@hotmail.com',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.printRequestTemplateId,
      templateParams
    );

    return response;
  } catch (error) {
    console.error('Error sending print-request notification:', error);
    throw error;
  }
};

const emailService = { sendOrderEmail, sendOwnerNotification, sendCustomerConfirmation, sendPrintRequestNotification };
export default emailService;
