import Header from '../../components/Header';
import React from "react";
import Hero from './Hero';
import Services from './Services';
import WhyChoose from './Whychoose';
import Footer from '../../components/Footer';
import './home-style.css';

function Home(props) {
  
  return (
    <div className="home-layout">
      <Header showAuth={props.isLogged} onLogout={props.onLogout} userName={props.userName} isAdmin={props.isAdmin} isWorker={props.isWorker} />
      <div className="home-main">
        <Hero />
        <Services />
        <WhyChoose />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
