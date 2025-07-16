import './App.css';

function App() {
  const products = [
    { name: "supermarket CartCoin", price: 5, image: "./cart-coin.jpg" },
    { name: "Gear Rhombo", price: 15, image: "./Images/Gear Rhombo.webp" },
    { name: "Casino chips", price: 15, image: "./Images/Casino chips.webp" },
    { name: "Spinner", price: 15, image: "./spinner.gif" },
    { name: "Infinity cubes", price: 15, image: "./Images/Infinity cubes.webp" },
    { name: "Gearbox", price: 10, image: "./placeholder-product.jpg" },
    { name: "Pyramid", price: 10, image: "./placeholder-product.jpg" },
    { name: "Maracas", price: 20, image: "./placeholder-product.jpg" },
    { name: "Dragon", price: 25, image: "./placeholder-product.jpg" },
    { name: "Ball pyramid", price: 15, image: "./placeholder-product.jpg" },
    { name: "Large hexagon", price: 20, image: "./placeholder-product.jpg" },
    { name: "Small hexagon", price: 10, image: "./placeholder-product.jpg" },
    { name: "Ghost on skateboard", price: 20, image: "./Images/Ghost on skateboard.webp" },
    { name: "Small Lubobo", price: 20, image: "./placeholder-product.jpg" },
    { name: "Large Lubobo", price: 30, image: "./placeholder-product.jpg" }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-title">🎯 3D Print Catalog</h1>
        <p className="subtitle">Quality 3D Printed Products at Great Prices</p>
      </header>
      
      <main className="products-section">
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-image-container">
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
        <p>Contact us for custom 3D printing requests!</p>
      </footer>
    </div>
  );
}

export default App;
