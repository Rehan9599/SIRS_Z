
import { Link } from "react-router-dom";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function Services() {
  return (
    <section className="section-block">
      <div className="section-head">
        <span className="section-kicker">
          <WarehouseOutlinedIcon fontSize="small" />
          <span>What ReadyCool handles</span>
        </span>
        <h2 className="section-heading">One platform for service, resale, and company work</h2>
        <p className="section-subtitle">
          Commercial service requests, refurbished inventory, and customer listings are managed through the same workflow so the business stays simple.
        </p>
      </div>

      <div className="service-grid">
        <article className="service-card">
          <div className="service-icon"><BuildOutlinedIcon /></div>
          <h3>Service & AMC</h3>
          <p>Planned maintenance, fault response, and recurring commercial service contracts.</p>
          <Link className="action-button action-button--ghost" to="/commercial">
            <span>Request service</span>
            <ArrowForwardRoundedIcon fontSize="small" />
          </Link>
        </article>

        <article className="service-card">
          <div className="service-icon"><VerifiedOutlinedIcon /></div>
          <h3>Buy Refurbished</h3>
          <p>Verified second-hand units are displayed without revealing the original seller identity.</p>
          <Link className="action-button action-button--ghost" to="/buy">
            <span>Browse inventory</span>
            <ArrowForwardRoundedIcon fontSize="small" />
          </Link>
        </article>

        <article className="service-card">
          <div className="service-icon"><SellOutlinedIcon /></div>
          <h3>Sell Your Unit</h3>
          <p>Post equipment with images and details, then let ReadyCool route the listing.</p>
          <Link className="action-button action-button--ghost" to="/sell">
            <span>Create listing</span>
            <ArrowForwardRoundedIcon fontSize="small" />
          </Link>
        </article>

        <article className="service-card">
          <div className="service-icon"><HandshakeOutlinedIcon /></div>
          <h3>Company Tenders</h3>
          <p>Dedicated handling for bids, AMC, and site work for commercial clients.</p>
          <Link className="action-button action-button--ghost" to="/commercial">
            <span>View commercial page</span>
            <ArrowForwardRoundedIcon fontSize="small" />
          </Link>
        </article>
      </div>

      <div className="cta-strip">
        <p>
          Need commercial refrigeration support, resale coordination, or a tender quote? The same team handles all three.
        </p>
        <Link className="action-button action-button--primary" to="/commercial">
          <span>Open commercial desk</span>
          <ArrowForwardRoundedIcon fontSize="small" />
        </Link>
      </div>
    </section>
  );
}

export default Services;
