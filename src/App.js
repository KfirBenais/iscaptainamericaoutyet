import logo from './ImportedPhoto.763906934.71299.jpeg';
import './App.css';

function App() {
  const phrases = [
    "No, the movie is not out yet.",
    "Sorry, the movie hasn't been released yet.",
    "Not yet, the movie is still not out.",
    "The movie is not available yet.",
    "Nope, the movie is still not released."
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ textDecoration: 'underline' }}> 
          Is "Captain America: Brave New World" out yet?
        </h1>
        <p>
          {randomPhrase}
        </p>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
