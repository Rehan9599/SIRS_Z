import { Link } from "react-router-dom";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function WhyChoose() {
  return (
    <section className="section-block">
      <div className="choose-layout">
        <div className="choose-card">
          <span className="section-kicker">
            <ShieldOutlinedIcon fontSize="small" />
            <span>Why businesses choose ReadyCool</span>
          </span>
          <h2 className="section-heading section-heading--spaced">
            Commercial users need speed, privacy, and repeatable service.
          </h2>

          <div className="choose-list">
            <div className="choose-item">
              <VerifiedOutlinedIcon />
              <div>
                <h4>Fast response</h4>
                <p>Service requests are routed to the right team instead of sitting in a generic inbox.</p>
              </div>
            </div>

            <div className="choose-item">
              <VerifiedOutlinedIcon />
              <div>
                <h4>Anonymous marketplace</h4>
                <p>Buyers see the item, not the original seller, so the resale flow stays private.</p>
              </div>
            </div>

            <div className="choose-item">
              <VerifiedOutlinedIcon />
              <div>
                <h4>Commercial support</h4>
                <p>AMC, tenders, and recurring maintenance are all managed through one front door.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="choose-card">
          <span className="section-kicker">
            <SupportAgentOutlinedIcon fontSize="small" />
            <span>Need a quote or support?</span>
          </span>
          <h2 className="section-heading section-heading--spaced">
            Tell us the equipment, location, and urgency.
          </h2>
          <p className="section-subtitle">
            We can route the request into service, procurement, or resale. That keeps the flow simple for commercial buyers and sellers.
          </p>
          <div className="cta-strip">
            <p>Open the commercial desk and choose the right service path for your business.</p>
            <Link className="action-button action-button--primary" to="/commercial">
              <span>Request support</span>
              <ArrowForwardRoundedIcon fontSize="small" />
            </Link>
          </div>
          <div className="choose-list">
            <div className="choose-item">
              <ShieldOutlinedIcon />
              <div>
                <h4>Privacy by default</h4>
                <p>We keep user-facing resale private while still showing the available inventory clearly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
