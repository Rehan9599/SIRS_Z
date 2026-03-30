
function Services() {
  return (
    <section className="services">
      <div className="container" style={{ maxWidth: '100vw', padding: 0 }}>
        {/* <p className="section-label">Services</p> */}
        <h2>What We Fix</h2>
        <p className="subtitle">Professional repair services for all major appliances</p>
        <div className="cards" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="card">
            <h3>AC Repair</h3>
            <p>All types of AC repair services</p>
            <button>Book AC Service</button>
          </div>
          <div className="card">
            <h3>Fridge Repair</h3>
            <p>Single & double door fridge repair</p>
            <button>Book Fridge Service</button>
          </div>
          <div className="card">
            <h3>Maintenance</h3>
            <p>Regular servicing & cleaning</p>
            <button>Book Maintenance</button>
          </div>
          <div className="card">
            <h3>Gas Filling</h3>
            <p>AC gas refilling service</p>
            <button>Book Gas Filling</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
