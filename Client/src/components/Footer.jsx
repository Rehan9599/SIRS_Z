import { Link } from "react-router-dom";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-grid">
          <div className="footer-card">
            <div className="brand">
              <span className="brand__mark">
                <AcUnitOutlinedIcon fontSize="small" />
              </span>
              <span className="brand__text">
                <strong>ReadyCool</strong>
                <span>service, resale, tenders</span>
              </span>
            </div>
            <p className="footer-text">
              Commercial refrigeration servicing, privacy-first resale, and tender support for companies and individual sellers.
            </p>
            <div className="badge">
              <VerifiedOutlinedIcon fontSize="small" />
              <span>Anonymous resale workflow</span>
            </div>
          </div>

          <div className="footer-card">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li><Link className="footer-link" to="/">Home</Link></li>
              <li><Link className="footer-link" to="/buy">Buy</Link></li>
              <li><Link className="footer-link" to="/sell">Sell</Link></li>
              <li><Link className="footer-link" to="/commercial">Commercial</Link></li>
            </ul>
          </div>

          <div className="footer-card">
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-list">
              <li className="icon-inline"><PhoneInTalkOutlinedIcon fontSize="small" /> <span>+91 98765 43210</span></li>
              <li className="icon-inline"><MailOutlineOutlinedIcon fontSize="small" /> <span>support@readycool.com</span></li>
              <li className="icon-inline"><LocationOnOutlinedIcon fontSize="small" /> <span>Commercial service coverage</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-note">
          <p>&copy; 2026 ReadyCool. All rights reserved.</p>
          <p>Buyer never sees the original seller identity in the resale flow.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
