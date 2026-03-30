import Header from './Header';
import React, { useState } from "react";
import Hero from './Hero';
import Services from './Services';
import WhyChoose from './Whychoose';
import Footer from './Footer';
import './Home.css';

function Home() {
  const [auth,SetAuth]=useState(true);
  return (
    <div className="home-layout">
      <div className="header-fullwidth">
        <Header showAuthButtons={auth} page='home' />
      </div>

      <div className="home-content">
        <Hero />
        <Services />
        <WhyChoose />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
