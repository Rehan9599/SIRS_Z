function WhyChoose() {
  return (
    <section className="why">
      <div className="container why-container">
        <div className="why-left">
          <p className="section-label">Why Choose Us</p>
          <h3>Why Customers Trust CoolFix</h3>

          <div className="features-grid">
            <div className="feature">
              <div className="icon">⚡</div>
              <div>
                <h4>Same Day Service</h4>
                <p>Quick response within 2 hours</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔</div>
              <div>
                <h4>Expert Technicians</h4>
                <p>Certified & experienced pros</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">🛡</div>
              <div>
                <h4>Warranty Service</h4>
                <p>Service guarantee on all repairs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="why-right">
          <span className="tag-small">📞 FAST & RELIABLE SERVICE</span>
          <h3>Need Urgent Repair?</h3>
          <p className="location">
            We're available 24/7 for emergency repairs. Call us now and we'll reach your
            location quickly.
          </p>
          <button className="call-btn big-btn">
            📞 Call Now: (123) 456-7890
          </button>
          <p className="location">📍 Serving all areas in Ghaziabad & nearby</p>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
