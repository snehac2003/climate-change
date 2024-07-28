import './App.css';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Scene1 from './components/Scene1';
import Scene2 from './components/Scene2';
import Slideshow from './components/Slideshow';
import './styles.css';

function App() {
  return (
    <div id="container">
      <Header />
      <main>
        {/* <Scene1 />
        <Scene2 /> */}
        <Slideshow />
      </main>
      <Footer />
    </div>
  );
}

export default App;
