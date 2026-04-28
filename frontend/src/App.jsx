import React from 'react';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Hero from './sections/Hero';
import Features from './sections/Features';
import CTA from './sections/CTA';

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
