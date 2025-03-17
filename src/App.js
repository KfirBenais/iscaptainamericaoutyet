import logo from './ImportedPhoto.763906934.71299.jpeg';
import './App.css';

function App() {
  const phrases = [
    "No, PAZ, the movie is not out for download yet.",
    "Sorry, PAZ, the movie hasn't been released for download yet.",
    "Not yet, PAZ, the movie is still not out for download.",
    "The movie is not available for download yet, PAZ.",
    "Nope, PAZ, the movie is still not released for download.",
    "Hang tight, PAZ, the movie isn't out for download yet.",
    "PAZ, you'll have to wait a bit longer, the movie isn't available for download.",
    "Unfortunately, PAZ, the movie is not ready for download yet.",
    "PAZ, the movie is still not out for download, please check back later.",
    "No, PAZ, the movie hasn't been released for download yet, stay tuned."
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ textDecoration: 'underline' }}> 
          Is "Captain America: Brave New World" out for download yet?
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
