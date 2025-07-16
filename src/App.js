import './App.css';
import { useState } from 'react';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { name: "Supermarket CartCoin", price: 5, image: "./Images/SuperMarketCoin.jpg" },
    { name: "Gear Rhombo", price: 15, image: "./Images/Gear Rhombo.webp" },
    { name: "Casino chips", price: 15, image: "./Images/Casino chips.webp" },
    { name: "Spinner", price: 15, image: "./Images/spinner.webp" },
    { name: "Infinity cubes", price: 15, image: "./Images/Infinity cubes.webp" },
    { name: "Gearbox", price: 10, image: "./Images/GearBox.webp" },
    { name: "ForeverSpin spinning top", price: 15, image: "./Images/spinning top.webp" },
        { name: "Vortex Man", price: 15, image: "./Images/VortexMan.webp" },
    { name: "Vortex Pyramid", price: 10, image: "./Images/VortexPyramid.webp" },
    { name: "Plane With Gun Set", price: 50, image: "./Images/PlaneWithGunSet.jpg" },
    { name: "Maracas", price: 20, image: "./Images/Maracas.jpg" },
    { name: "Dragon", price: 25, image: "./Images/Dragon.jpg" },
    { name: "Balls Vortex", price: 15, image: "./Images/Balls Vortex.webp" },
    { name: "Large hexagon", price: 20, image: "./Images/Hexagon.webp" },
    { name: "Ghost on skateboard", price: 20, image: "./Images/Ghost on skateboard.webp" },
    { name: "Small Batman", price: 20, image: "./Images/LittleBatman.jpg" },
    { name: "Small Labubu", price: 20, image: "./Images/SmallLabubu.jpg" },
    { name: "Large Labubu", price: 30, image: "./Images/LargeLabubu.jpg" },
     { name: "Pikachu Labubu", price: 40, image: "./Images/Labubupikachu.jpg" },
     { name: "Jelly Fish", price: 20, image: "./Images/jellyfish.jpg" },
    { name: "Jelly Fish On Stand", price: 30, image: "./Images/jellyfishOnStand.webp" },
    { name: "Candy Dispenser", price: 40, image: "./Images/Candy Dispenser.jpg" },
    { name: "Iran War Set", price: 50, image: "./Images/IranWarSet.jpg" },
    { name: "Door Stopper", price: 10, image: "./Images/DoorStopper.jpg" }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-title">🎯 Benais 3D Prints Catalog</h1>
        <p className="subtitle">Quality 3D Printed Products at Great Prices</p>
      </header>
      
      <section className="color-info-section">
        <div className="color-info-container">
          <h2 className="color-info-title">🎨 Color Options</h2>
          <p className="color-notice">
            All prints can be made in any of our available colors. 
            Combinations of more than 2 colors may incur additional material costs.
            <br />
            <strong>Colors are updated in real-time - some colors may be temporarily out of stock.</strong>
          </p>
          
          <div className="colors-grid">
            <div className="color-item">
              <div className="color-square white"></div>
              <span>White</span>
            </div>
            <div className="color-item">
              <div className="color-square black"></div>
              <span>Black</span>
            </div>
            <div className="color-item">
              <div className="color-square rainbow"></div>
              <span>Rainbow (Surprise!)</span>
            </div>
            <div className="color-item">
              <div className="color-square red"></div>
              <span>Red</span>
            </div>
            <div className="color-item">
              <div className="color-square blue"></div>
              <span>Blue</span>
            </div>
            <div className="color-item">
              <div className="color-square beige"></div>
              <span>Beige (Skin tone)</span>
            </div>
            <div className="color-item">
              <div className="color-square red-blue"></div>
              <span>Red/Blue Mix</span>
            </div>
            <div className="color-item">
              <div className="color-square yellow"></div>
              <span>Yellow</span>
            </div>
            <div className="color-item">
              <div className="color-square transparent"></div>
              <span>Transparent</span>
            </div>
            <div className="color-item">
              <div className="color-square green"></div>
              <span>Green</span>
            </div>
            <div className="color-item">
              <div className="color-square bronze"></div>
              <span>Bronze</span>
            </div>
            <div className="color-item">
              <div className="color-square purple"></div>
              <span>Purple</span>
            </div>
          </div>
        </div>
      </section>
      
      <main className="products-section">
        <div className="products-grid">
          {products.map((product, index) => (
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
                {/* <button className="contact-button">Contact for Order</button> */}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="App-footer">
        <p><strong>benais3dprints</strong> - Contact us for custom 3D printing requests!</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
