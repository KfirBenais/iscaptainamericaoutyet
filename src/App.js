import './App.css';
import { useState, useMemo, useCallback, useEffect } from 'react';
import AddToCartModal from './AddToCartModal';
import Cart from './Cart';
import Checkout from './Checkout';
import {
  LanguageContext,
  translations,
  getDefaultLanguage,
  getTranslationValue,
  getCategoryLabel,
  getColorLabel
} from './i18n';

const colorPalette = [
  { name: 'White', className: 'white' },
  { name: 'Black', className: 'black' },
  { name: 'Rainbow (Surprise!)', className: 'rainbow' },
  { name: 'Red', className: 'red' },
  { name: 'Blue', className: 'blue' },
  { name: 'Beige (Skin tone)', className: 'beige' },
  { name: 'Yellow', className: 'yellow' },
  { name: 'Transparent', className: 'transparent' },
  { name: 'Green', className: 'green' },
  { name: 'Bronze', className: 'bronze' },
  { name: 'Purple', className: 'purple' },
  { name: 'Gray', className: 'gray' },
  { name: 'Green/Red/Blue Mix', className: 'green-red-darkblue' },
  { name: 'White Marble', className: 'white-marble' },
  { name: 'Glow Glitter Green', className: 'glow-glitter-green' },
  { name: 'Galaxy', className: 'galaxy' },
  { name: 'Orange TPU', className: 'orange-tpu' }
];

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);
  const [language, setLanguage] = useState(getDefaultLanguage());

  const dictionary = useMemo(() => translations[language], [language]);
  const t = useCallback((key) => {
    return getTranslationValue(dictionary, key) ?? key;
  }, [dictionary]);
  const isHebrew = language === 'he';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isHebrew ? 'rtl' : 'ltr';
    }
  }, [language, isHebrew]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage?.setItem('preferredLanguage', language);
      } catch (err) {
        // Ignore storage issues silently
      }
    }
  }, [language]);

  const products = [
    { name: "Eevee", price: 30, image: "./Images/Eevee.jpeg", category: "Figurines" },
    { name: "Banana Holder", price: 10, image: "./Images/BananaHolder.jpeg", category: "Utilities" },
    { name: "Snow Castle With Trees", price: 25, image: "./Images/ChurchCastle.jpeg", category: "Figurines" },
    { name: "Beyblade arena", price: 20, image: "./Images/Beyblade_arena.jpeg", category: "Toys" },
    { name: "Glasses Box", price: 25, image: "./Images/GlassesBox.jpeg", category: "Utilities" },
    { name: "Soda Can Opener", price: 8, image: "./Images/CanOpener.jpeg", category: "Utilities" },
    { name: "Birth Present", price: 30, image: "./Images/BirthPresent.webp", category: "Decorative" },
    { name: "Bag Clips", price: 3, image: "./Images/BagClips.jpg", category: "Utilities" },
    { name: "Bag Clips With Lid", price: 5, image: "./Images/BagClipsLid.jpeg", category: "Utilities" },
    { name: "Bunny Vortex", price: 15, image: "./Images/BunnyVortex.webp", category: "Fidgets" },
    { name: "Morf Worm", price: 15, image: "./Images/MorfWorm.webp", category: "Fidgets" },
    { name: "Flexi Crab", price: 10, image: "./Images/FlexiCrab.jpg", category: "Toys" },
    { name: "Flexi Penguin", price: 10, image: "./Images/FlexiPenguin.jpg", category: "Toys" },
    { name: "Fidget Collection", price: 15, image: "./Images/FidgetCollection.webp", category: "Fidgets" },
    { name: "Phone Stand", price: 20, image: "./Images/PhoneStand.png", category: "Utilities" },
    { name: "Spilling Glass", price: 25, image: "./Images/SpillingGlass.png", category: "Decorative" },
    { name: "Knitted Heart Flower", price: 25, image: "./Images/KnittedHeartFlower.png", category: "Decorative" },
    { name: "Supermarket CartCoin", price: 5, image: "./Images/SuperMarketCoin.jpg", category: "Utilities" },
    { name: "Hamsa", price: 5, image: "./Images/Hamsa.jpg", category: "Decorative" },
    { name: "Heart KeyChain", price: 8, image: "./Images/HeartKeyChain.jpg", category: "Decorative" },
     { name: "Custom Photo Frame", price: 20, image: "./Images/CustomPhotoFrame.jpg", category: "Decorative" },
    { name: "Gear Rhombo", price: 15, image: "./Images/Gear Rhombo.webp", category: "Fidgets" },
    { name: "Casino chips", price: 15, image: "./Images/Casino chips.webp", category: "Fidgets" },
    { name: "Spinner", price: 15, image: "./Images/spinner.webp", category: "Fidgets" },
    { name: "Infinity cubes", price: 20, image: "./Images/Infinity cubes.webp", category: "Fidgets" },
    { name: "Gearbox", price: 10, image: "./Images/GearBox.webp", category: "Fidgets" },
    { name: "Nasa Fabric", price: 20, image: "./Images/NasaFabric.jpeg", category: "Fidgets" },
    { name: "ForeverSpin spinning top", price: 10, image: "./Images/spinning top.webp", category: "Toys" },
    { name: "Vortex Man", price: 15, image: "./Images/VortexMan.webp", category: "Decorative" },
    { name: "Vortex Pyramid", price: 10, image: "./Images/VortexPyramid.webp", category: "Fidgets" },
    { name: "Plane With Gun Set", price: 25, image: "./Images/PlaneWithGunSet.jpg", category: "Toys" },
    { name: "Extra Plane", price: 10, image: "./Images/Plane.webp", category: "Toys" },
    { name: "Desk Basketball hoop", price: 30, image: "./Images/DeskBasketball.webp", category: "Toys" },
    { name: "Maracas", price: 15, image: "./Images/Maracas.jpg", category: "Toys" },
    { name: "Dragon", price: 25, image: "./Images/Dragon.jpg", category: "Decorative" },
    { name: "Balls Vortex", price: 15, image: "./Images/Balls Vortex.webp", category: "Fidgets" },
    { name: "Large hexagon", price: 20, image: "./Images/Hexagon.webp", category: "Fidgets" },
    { name: "Ghost on skateboard", price: 20, image: "./Images/Ghost on skateboard.webp", category: "Toys" },
    { name: "Knitted Animals", price: 15, image: "./Images/knittedAnimels.webp", category: "Figurines" },
    { name: "Small Batman", price: 15, image: "./Images/LittleBatman.jpg", category: "Figurines" },
    { name: "Small Labubu", price: 20, image: "./Images/SmallLabubu.jpg", category: "Figurines" },
    { name: "Large Labubu", price: 30, image: "./Images/LargeLabubu.jpg", category: "Figurines" },
    { name: "Pikachu Labubu", price: 40, image: "./Images/Labubupikachu.jpg", category: "Figurines" },
    { name: "Jelly Fish", price: 20, image: "./Images/jellyfish.jpg", category: "Decorative" },
    { name: "Jelly Fish On Stand", price: 25, image: "./Images/jellyfishOnStand.webp", category: "Decorative" },
    { name: "Candy Dispenser", price: 35, image: "./Images/Candy Dispenser.jpg", category: "Toys" },
    { name: "Iran War Set", price: 40, image: "./Images/IranWarSet.jpg", category: "Toys" },
    { name: "Door Stopper", price: 10, image: "./Images/DoorStopper.jpg", category: "Utilities" },
    { name: "Custom Name Plate", price: 20, image: "./Images/CustomNamePlate.webp", category: "Decorative" },
    { name: "Switch 2 Mouse Adapter", price: 30, image: "./Images/Switch2MouseAdapter.jpg", category: "Utilities" },
    { name: "Pen Holder - Desk Organizer", price: 30, image: "./Images/PenHolder.jpg", category: "Utilities" },
    { name: "Mosquito Net Dual-Sided Tool", price: 10, image: "./Images/MosquitoNetTool.webp", category: "Utilities" },
    
  ];

  // Get unique categories
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Cart functions
  const addToCart = (product, quantity, colors, notes) => {
    const cartItem = {
      id: Date.now(),
      product,
      quantity,
      colors,
      notes,
      totalPrice: product.price * quantity
    };
    setCart([...cart, cartItem]);
    setShowAddToCart(false);
    setProductToAdd(null);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId, quantity) => {
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalPrice: item.product.price * quantity }
        : item
    ));
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddToCartClick = (product) => {
    setProductToAdd(product);
    setShowAddToCart(true);
    setSelectedProduct(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'he' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, t, dictionary }}>
      <div className={`App ${isHebrew ? 'rtl' : ''}`} dir={isHebrew ? 'rtl' : 'ltr'}>
        <button
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={t('languageToggle.ariaLabel')}
        >
          <span className="language-icon">🌐</span>
          <span className="language-label">{language === 'en' ? 'עברית' : 'English'}</span>
        </button>
        <header className="App-header">
        <div className="header-content">
          <div className="header-title">
            <h1 className="main-title">{t('header.title')}</h1>
            <p className="subtitle">{t('header.subtitle')}</p>
          </div>
          <div className="cart-icon-container" onClick={() => setShowCart(true)}>
            <div className="cart-icon">🛒</div>
            {getCartItemsCount() > 0 && (
              <div className="cart-badge">{getCartItemsCount()}</div>
            )}
          </div>
        </div>
      </header>
      
      <section className="color-info-section">
        <div className="color-info-container">
          <h2 className="color-info-title">{t('colorSection.title')}</h2>
          <p className="color-notice">
            {t('colorSection.description')}
            <br />
            <strong>{t('colorSection.realtimeNotice')}</strong>
          </p>
          
          <div className="colors-grid">
            {colorPalette.map((color) => (
              <div className="color-item" key={color.name}>
                <div className={`color-square ${color.className}`}></div>
                <span>{getColorLabel(color.name, language)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="category-filter-section">
        <div className="category-filter-container">
          <h3 className="category-filter-title">{t('categories.title')}</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryLabel(category, language)}
                <span className="category-count">
                  ({category === 'All' ? products.length : products.filter(p => p.category === category).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      <main className="products-section">
        <div className="products-header">
          <h2 className="products-title">
            {selectedCategory === 'All' ? t('products.all') : getCategoryLabel(selectedCategory, language)} 
            <span className="products-count">({filteredProducts.length} {t('products.countLabel')})</span>
          </h2>
        </div>
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              <div 
                className="product-image-container"
                onClick={() => setSelectedProduct(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="placeholder-image" style={{display: 'none'}}>
                  <span className="placeholder-text">📦</span>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price} ₪</p>
                <button 
                  className="quick-add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCartClick(product);
                  }}
                >
                  {t('buttons.addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="App-footer">
        <p><strong>benais3dprints</strong> - {t('footer.text')}</p>
      </footer>

      {/* Modal */}
      {selectedProduct && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProduct(null);
            }
          }}
        >
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <div className="modal-image-container">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="modal-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="modal-placeholder" style={{display: 'none'}}>
                📦
              </div>
            </div>
            <div className="modal-info">
              <h2 className="modal-name">{selectedProduct.name}</h2>
              <p className="modal-price">{selectedProduct.price} ₪</p>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCartClick(selectedProduct)}
              >
                {t('buttons.addToCart')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {showAddToCart && productToAdd && (
        <AddToCartModal
          product={productToAdd}
          onAdd={addToCart}
          onClose={() => {
            setShowAddToCart(false);
            setProductToAdd(null);
          }}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateCartItem}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={() => {
            setCart([]);
            setShowCheckout(false);
            alert(t('alerts.orderSuccess'));
          }}
        />
      )}
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
