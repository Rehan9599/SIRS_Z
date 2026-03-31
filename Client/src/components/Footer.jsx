function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ReadyCool</h4>
            <p>Professional appliance repair services in Delhi NCR</p>
          </div>
          
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5>Contact</h5>
            <p>📞 +91 98765 43210</p>
            <p>📧 info@readycool.com</p>
            <p>📍 Delhi NCR</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 ReadyCool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
