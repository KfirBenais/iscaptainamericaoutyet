import { createContext, useContext } from 'react';

export const translations = {
  en: {
    header: {
      title: '🎯 Benais 3D Prints Catalog',
      subtitle: 'Quality 3D Printed Products at Great Prices'
    },
    colorSection: {
      title: '🎨 Color Options',
      description: 'All prints can be made in any of our available colors. Combinations of more than 2 colors may incur additional material costs.',
      realtimeNotice: 'Colors are updated in real-time - some colors may be temporarily out of stock.'
    },
    categories: {
      title: '📂 Browse by Category'
    },
    products: {
      all: 'All Products',
      countLabel: 'items'
    },
    footer: {
      text: 'Contact us for custom 3D printing requests!'
    },
    buttons: {
      addToCart: 'Add to Cart',
      continueShopping: 'Continue Shopping',
      proceedToCheckout: 'Proceed to Checkout',
      backToCart: 'Back to Cart',
      placeOrder: 'Place Order',
      paymentDone: '✅ Payment Completed',
      paymentCancel: 'Cancel'
    },
    addToCart: {
      priceEachSuffix: 'each',
      quantity: 'Quantity:',
      selectColors: 'Select Colors:',
      notesLabel: 'Special Notes (color settings, preferences, etc.):',
      notesPlaceholder: 'Add any special instructions about colors, size preferences, or other customizations...',
      total: 'Total:',
      selectColorAlert: 'Please select at least one color'
    },
    cart: {
      title: 'Your Cart',
      empty: '🛒 Your cart is empty',
      colors: 'Colors',
      notes: 'Notes',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      total: 'Total',
      each: 'each',
      itemLabelSingular: 'item',
      itemLabelPlural: 'items'
    },
    checkout: {
      title: 'Checkout',
      customerInfoTitle: 'Your Information',
      fields: {
        name: { label: 'Full Name *', placeholder: 'Enter your full name' },
        email: { label: 'Email Address *', placeholder: 'Enter your email' },
        phone: { label: 'Phone Number *', placeholder: 'Enter your phone number' }
      },
      orderSummaryTitle: 'Order Summary',
      quantityLabel: 'Qty',
      colorsLabel: 'Colors',
      notesLabel: 'Notes',
      total: 'Total',
      payment: {
        title: 'Complete Your Payment',
        orderId: 'Order ID',
        totalAmount: 'Total Amount',
        qrPlaceholder: '📱 QR Code for Payment',
        qrUnavailable: 'QR Code temporarily unavailable',
        qrContact: 'Please contact us for payment instructions',
        scanInstructionPrefix: 'Scan with your BIT app to pay',
        instructionsTitle: 'Payment Instructions:',
        steps: [
          'Open your BIT app',
          'Scan the QR code above',
          'Confirm the payment amount',
          'Complete the transaction'
        ]
      }
    },
    alerts: {
      orderSuccess: 'Order placed successfully! You will receive a confirmation email shortly.',
      checkoutMissingFields: 'Please fill in all required fields'
    },
    languageToggle: {
      ariaLabel: 'Toggle site language'
    }
  },
  he: {
    header: {
      title: '🎯 קטלוג ההדפסות של Benais 3D',
      subtitle: 'מוצרים מודפסים באיכות גבוהה ובמחירים מעולים'
    },
    colorSection: {
      title: '🎨 אפשרויות צבע',
      description: 'כל ההדפסות יכולות להתבצע בכל אחד מהצבעים הזמינים שלנו. שילובים של יותר משני צבעים עלולים לדרוש עלות חומר נוספת.',
      realtimeNotice: 'מלאי הצבעים מתעדכן בזמן אמת - ייתכן שחלקם לא יהיו זמינים זמנית.'
    },
    categories: {
      title: '📂 דפדוף לפי קטגוריה'
    },
    products: {
      all: 'כל המוצרים',
      countLabel: 'פריטים'
    },
    footer: {
      text: 'דברו איתנו עבור בקשות מותאמות אישית להדפסת תלת-ממד!'
    },
    buttons: {
      addToCart: 'הוסף לעגלה',
      continueShopping: 'המשך קנייה',
      proceedToCheckout: 'לתשלום',
      backToCart: 'חזרה לעגלה',
      placeOrder: 'ביצוע הזמנה',
      paymentDone: '✅ התשלום הושלם',
      paymentCancel: 'ביטול'
    },
    addToCart: {
      priceEachSuffix: 'ליחידה',
      quantity: 'כמות:',
      selectColors: 'בחרו צבעים:',
      notesLabel: "הערות מיוחדות (צבעים, העדפות וכו')",
      notesPlaceholder: 'כתבו הוראות מיוחדות לגבי צבעים, מידות או התאמות נוספות...',
      total: 'סה"כ:',
      selectColorAlert: 'אנא בחרו לפחות צבע אחד'
    },
    cart: {
      title: 'העגלה שלכם',
      empty: '🛒 העגלה ריקה',
      colors: 'צבעים',
      notes: 'הערות',
      quantity: 'כמות',
      subtotal: 'ביניים',
      total: 'סה"כ',
      each: 'ליחידה',
      itemLabelSingular: 'פריט',
      itemLabelPlural: 'פריטים'
    },
    checkout: {
      title: 'תשלום',
      customerInfoTitle: 'הפרטים שלכם',
      fields: {
        name: { label: 'שם מלא *', placeholder: 'הקלידו שם מלא' },
        email: { label: 'דואר אלקטרוני *', placeholder: 'הקלידו כתובת מייל' },
        phone: { label: 'טלפון *', placeholder: 'הקלידו מספר טלפון' }
      },
      orderSummaryTitle: 'סיכום הזמנה',
      quantityLabel: 'כמות',
      colorsLabel: 'צבעים',
      notesLabel: 'הערות',
      total: 'סה"כ',
      payment: {
        title: 'השלימו את התשלום',
        orderId: 'מספר הזמנה',
        totalAmount: 'סכום לתשלום',
        qrPlaceholder: '📱 קוד QR לתשלום',
        qrUnavailable: 'קוד ה-QR אינו זמין זמנית',
        qrContact: 'צרו קשר לקבלת הוראות תשלום',
        scanInstructionPrefix: 'סרקו באפליקציית BIT כדי לשלם',
        instructionsTitle: 'הוראות תשלום:',
        steps: [
          'פתחו את אפליקציית BIT',
          'סרקו את קוד ה-QR שמופיע',
          'אשרו את סכום העסקה',
          'השלימו את התשלום'
        ]
      }
    },
    alerts: {
      orderSuccess: 'ההזמנה בוצעה בהצלחה! אישור יישלח אליכם במייל בקרוב.',
      checkoutMissingFields: 'אנא מלאו את כל השדות החיוניים'
    },
    languageToggle: {
      ariaLabel: 'החלפת שפת האתר'
    }
  }
};

export const categoryLabels = {
  en: {
    All: 'All',
    Figurines: 'Figurines',
    Utilities: 'Utilities',
    Toys: 'Toys',
    Decorative: 'Decorative',
    Fidgets: 'Fidgets'
  },
  he: {
    All: 'הכל',
    Figurines: 'פסלונים',
    Utilities: 'עזרים',
    Toys: 'צעצועים',
    Decorative: 'דקורציה',
    Fidgets: 'פידג\'טים'
  }
};

export const colorLabels = {
  en: {
    'White': 'White',
    'Black': 'Black',
    'Rainbow (Surprise!)': 'Rainbow (Surprise!)',
    'Red': 'Red',
    'Blue': 'Blue',
    'Beige (Skin tone)': 'Beige (Skin tone)',
    'Yellow': 'Yellow',
    'Transparent': 'Transparent',
    'Green': 'Green',
    'Bronze': 'Bronze',
    'Purple': 'Purple',
    'Gray': 'Gray',
    'Green/Red/Blue Mix': 'Green/Red/Blue Mix',
    'White Marble': 'White Marble',
    'Glow Glitter Green': 'Glow Glitter Green',
    'Galaxy': 'Galaxy',
    'Orange TPU': 'Orange TPU',
    'Black TPU': 'Black TPU',
    'WOOD': 'wood'
  },
  he: {
    'White': 'לבן',
    'Black': 'שחור',
    'Rainbow (Surprise!)': 'קשת (הפתעה!)',
    'Red': 'אדום',
    'Blue': 'כחול',
    'Beige (Skin tone)': 'בז\' (גוון עור)',
    'Yellow': 'צהוב',
    'Transparent': 'שקוף',
    'Green': 'ירוק',
    'Bronze': 'ברונזה',
    'Purple': 'סגול',
    'Gray': 'אפור',
    'Green/Red/Blue Mix': 'תערובת ירוק/אדום/כחול',
    'White Marble': 'שיש לבן',
    'Glow Glitter Green': 'ירוק זוהר מנצנץ',
    'Galaxy': 'גלקסי',
    'Orange TPU': 'TPU כתום',
    'Black TPU': 'TPU שחור',
    'WOOD': 'עץ'
  }
};

export const LanguageContext = createContext({
  language: 'en',
  t: (key) => key,
  dictionary: translations.en
});

export const useLanguage = () => useContext(LanguageContext);

export const getDefaultLanguage = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage?.getItem('preferredLanguage');
      if (stored && translations[stored]) {
        return stored;
      }
    } catch (err) {
      // Ignore storage issues and fall back to browser language
    }
  }

  if (typeof navigator !== 'undefined') {
    const browserLanguage = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;

    if (browserLanguage) {
      return browserLanguage.toLowerCase().startsWith('he') ? 'he' : 'en';
    }
  }
  return 'en';
};

export const getTranslationValue = (dictionary, keyPath) => {
  return keyPath.split('.').reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, dictionary);
};

export const getCategoryLabel = (category, language) => {
  return categoryLabels[language]?.[category] ?? category;
};

export const getColorLabel = (color, language) => {
  return colorLabels[language]?.[color] ?? color;
};
