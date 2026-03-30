import fridgeImg from '../Home/assets/fridge.jpg'; // Replace with your image

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="tag">🔥 Best Service</div>
        <h1>
          Fast & Reliable <br />
          <span>Repair Service</span>
        </h1>
        <p className="desc">
          We provide quick and professional repair services at your doorstep.
        </p>

        <div className="buttons">
          <button className="btn btn-primary">Call Now</button>
          <button className="btn btn-outline">Book Now</button>
        </div>

        <div className="features">
          <span>✔ 24/7 Service</span>
          <span>✔ Trusted Experts</span>
          <span>✔ Affordable</span>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-card">
          <img src={fridgeImg} alt="AC & Fridge Repair Service" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
