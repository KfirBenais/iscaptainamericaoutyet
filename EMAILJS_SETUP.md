# EmailJS Setup Guide for Benais 3D Prints

## Step 1: Create EmailJS Account
1. Go to [https://emailjs.com/](https://emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection instructions
5. **Copy the Service ID** - you'll need this

## Step 3: Create Email Templates

### Template 1: Business Owner Notification
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Name it "Owner Order Notification"
4. Use this template structure:

```
Subject: 🛒 New Order from Benais 3D Prints - {{order_id}}

**New Order Received!**

Order Details:
- Order ID: {{order_id}}
- Date: {{order_date}}
- Items Count: {{items_count}}

Customer Information:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Phone: {{customer_phone}}

Order Items:
{{order_items}}

**Total Amount: {{total_amount}} ₪**

---
This email was automatically sent from your 3D printing website.
```

5. **Copy the Template ID** - this is your `ownerTemplateId`

### Template 2: Customer Confirmation Email
1. Create another new template
2. Name it "Customer Order Confirmation"
3. **Switch to HTML mode** in the template editor
4. Copy and paste this beautiful template:

```html
Subject: ✅ Order Confirmation - Benais 3D Prints - {{order_id}}

<div
  style="
    font-family: system-ui, sans-serif, Arial;
    font-size: 14px;
    color: #333;
    padding: 14px 8px;
    background-color: #f5f5f5;
  "
>
  <div style="max-width: 600px; margin: auto; background-color: #fff">
    <div style="border-top: 6px solid #458500; padding: 16px">
      <span
        style="
          font-size: 18px;
          vertical-align: middle;
          color: #458500;
        "
      >
        <strong>🎯 Benais 3D Prints</strong>
      </span>
      <span
        style="
          font-size: 16px;
          vertical-align: middle;
          border-left: 1px solid #333;
          padding-left: 8px;
          margin-left: 8px;
        "
      >
        <strong>Thank You for Your Order, {{customer_name}}!</strong>
      </span>
    </div>
    <div style="padding: 0 16px">
      <p>Thank you for choosing Benais 3D Prints! We'll start working on your custom 3D printed items right away. You'll receive tracking information when the order ships.</p>
      <div
        style="
          text-align: left;
          font-size: 14px;
          padding-bottom: 4px;
          border-bottom: 2px solid #333;
        "
      >
        <strong>Order # {{order_id}}</strong>
      </div>
      {{#orders}}
      <table style="width: 100%; border-collapse: collapse">
        <tr style="vertical-align: top">
          <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content">
            <img 
              style="height: 64px; width: 64px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;" 
              height="64px" 
              width="64px"
              src="{{image_url}}" 
              alt="{{name}}"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="height: 64px; width: 64px; background: #f0f0f0; border-radius: 8px; display: none; align-items: center; justify-content: center; font-size: 24px; border: 1px solid #ddd;">📦</div>
          </td>
          <td style="padding: 24px 8px 0 8px; width: 100%">
            <div><strong>{{name}}</strong></div>
            <div style="font-size: 14px; color: #888; padding-top: 4px">QTY: {{units}}</div>
            {{#notes}}
            <div style="font-size: 12px; color: #666; padding-top: 2px; font-style: italic">Notes: {{notes}}</div>
            {{/notes}}
          </td>
          <td style="padding: 24px 4px 0 0; white-space: nowrap">
            <strong>{{price}} ₪</strong>
          </td>
        </tr>
      </table>
      {{/orders}}
      <div style="padding: 24px 0">
        <div style="border-top: 2px solid #333"></div>
      </div>
      <table style="border-collapse: collapse; width: 100%; text-align: right">
        <tr>
          <td style="width: 60%"></td>
          <td>Shipping</td>
          <td style="padding: 8px; white-space: nowrap">{{cost.shipping}} ₪</td>
        </tr>
        <tr>
          <td style="width: 60%"></td>
          <td>Taxes</td>
          <td style="padding: 8px; white-space: nowrap">{{cost.tax}} ₪</td>
        </tr>
        <tr>
          <td style="width: 60%"></td>
          <td style="border-top: 2px solid #333">
            <strong style="white-space: nowrap">Order Total</strong>
          </td>
          <td style="padding: 16px 8px; border-top: 2px solid #333; white-space: nowrap">
            <strong>{{cost.total}} ₪</strong>
          </td>
        </tr>
      </table>
      
      <div style="margin: 24px 0; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #458500;">🎨 Your Color Choices</h4>
        <p style="margin: 0; font-size: 13px; color: #666;">
          All items will be 3D printed in your selected colors. If you have any specific requests or need to make changes, please contact us immediately.
        </p>
      </div>
      
      <div style="margin: 24px 0; padding: 16px; background-color: #e7f3ff; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #0066cc;">📱 Payment Instructions</h4>
        <p style="margin: 0; font-size: 13px; color: #333;">
          Please complete your payment using the QR code shown during checkout. Once payment is confirmed, we'll begin production immediately.
        </p>
      </div>
    </div>
  </div>
  <div style="max-width: 600px; margin: auto">
    <p style="color: #999; text-align: center; font-size: 12px;">
      This email was sent to {{customer_email}}<br />
      You received this email because you placed an order with Benais 3D Prints<br />
      <strong>benais3dprints</strong> - Contact us for custom 3D printing requests!
    </p>
  </div>
</div>
```

5. **Copy the Template ID** - this is your `customerTemplateId`

## Step 4: Get Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** - you'll need this

## Step 5: Update Configuration
1. Open `src/emailService.js`
2. Replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',           // Replace with your Service ID
  ownerTemplateId: 'YOUR_OWNER_TEMPLATE_ID',    // Replace with Owner Template ID  
  customerTemplateId: 'YOUR_CUSTOMER_TEMPLATE_ID', // Replace with Customer Template ID
  publicKey: 'YOUR_PUBLIC_KEY'            // Replace with your Public Key
};
```

3. Your email address is already configured in the file

## Step 6: Test the Integration
1. Save all files
2. Start your development server: `npm start`
3. Test placing an order
4. Check both your inbox (owner notification) and customer's inbox (confirmation)

## What Happens Now:
1. **Customer places order** → Fills checkout form
2. **Two emails sent automatically**:
   - **You receive**: Detailed order notification with all customer info and items
   - **Customer receives**: Beautiful order confirmation with their order details
3. **Customer sees QR code** → Completes payment
4. **You fulfill the order** → Based on the detailed email you received

## Template Variables Available:

### Owner Notification Template:
- `{{order_id}}` - Unique order identifier
- `{{customer_name}}` - Customer's full name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone number
- `{{order_items}}` - Formatted list of all ordered items
- `{{total_amount}}` - Total order amount
- `{{order_date}}` - Date and time of order
- `{{items_count}}` - Number of items in order

### Customer Confirmation Template:
- `{{order_id}}` - Order number
- `{{customer_name}}` - Customer's name
- `{{customer_email}}` - Customer's email
- `{{orders}}` - Array of order items with name, units, price, notes
- `{{cost.shipping}}` - Shipping cost
- `{{cost.tax}}` - Tax amount  
- `{{cost.total}}` - Total amount

## Free Plan Limits:
- 200 emails per month
- Basic features
- Perfect for getting started

## Security Notes:
- The Public Key is safe to expose in client-side code
- Service ID and Template ID are also safe to expose
- Never expose your Private Key in client-side code

## Troubleshooting:
1. Check browser console for error messages
2. Verify all IDs are correct
3. Make sure your email service is properly connected
4. Check spam folder for test emails
5. Ensure your domain is added to allowed origins (if needed)

---

Once configured, customers will place orders → You'll automatically receive detailed email notifications → You can fulfill the orders manually!
