import Header from '../../components/Header';
import React, { useState } from "react";
import Hero from './Hero';
import Services from './Services';
import WhyChoose from './Whychoose';
import Footer from '../../components/Footer';
import './Home.css';

function Home(props) {
  
  return (
    <div className="home-layout">
      <div className="header-fullwidth">
        {console.log(props.isLogged)}
        <Header showAuth={props.isLogged} />
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
