import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

function Hero() {
  const excellenceStats = useMemo(() => [
    {
      label: "Service requests handled",
      target: 2400,
      formatValue: (value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k+` : `${value}+`),
      detail: "Commercial tickets routed with priority response.",
      icon: <SupportAgentOutlinedIcon />
    },
    {
      label: "Verified resale closures",
      target: 890,
      formatValue: (value) => `${value}+`,
      detail: "Seller identity protected across every transaction.",
      icon: <HandshakeOutlinedIcon />
    },
    {
      label: "First-response speed",
      target: 4,
      formatValue: (value) => `< ${Math.max(1, value)} hrs`,
      detail: "Fast triage for urgent cooling equipment issues.",
      icon: <BoltOutlinedIcon />
    }
  ], []);

  const [animatedValues, setAnimatedValues] = useState(() =>
    excellenceStats.map(() => 0)
  );

  useEffect(() => {
    let animationFrame;
    const durationMs = 1300;
    const animationStart = performance.now();

    const runAnimation = (now) => {
      const progress = Math.min((now - animationStart) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(
        excellenceStats.map((item) => Math.round(item.target * eased))
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(runAnimation);
      }
    };

    animationFrame = requestAnimationFrame(runAnimation);
    return () => cancelAnimationFrame(animationFrame);
  }, [excellenceStats]);

  const excellenceSignals = [
    {
      title: "Verified service flow",
      text: "Each request is routed to the right commercial support path.",
      icon: <VerifiedOutlinedIcon />
    },
    {
      title: "Resale coordination",
      text: "Used appliances are listed, reviewed, and moved anonymously.",
      icon: <LocalShippingOutlinedIcon />
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="section-kicker">
            <AcUnitOutlinedIcon fontSize="small" />
            <span>Commercial cooling and resale network</span>
          </div>
          <h1 className="hero-title">
            Service, buy, and sell <span>commercial refrigeration</span>
          </h1>
          <p className="hero-text">
            ReadyCool connects service requests, second-hand inventory, and company tenders in a single privacy-first flow for commercial cooling equipment.
          </p>

          <div className="hero-actions">
            <Link className="action-button action-button--primary" to="/commercial">
              <BusinessCenterOutlinedIcon fontSize="small" />
              <span>Book service</span>
            </Link>
            <Link className="action-button action-button--ghost" to="/buy">
              <SellOutlinedIcon fontSize="small" />
              <span>Browse stock</span>
            </Link>
          </div>

          <div className="hero-metrics">
            <div className="metric-card">
              <strong>Service first</strong>
              <span>AMC, maintenance, and urgent commercial support.</span>
            </div>
            <div className="metric-card">
              <strong>Seller privacy</strong>
              <span>Buyers never see the original seller in our resale flow.</span>
            </div>
            <div className="metric-card">
              <strong>Company ready</strong>
              <span>Built for tenders, recurring visits, and contracts.</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="excellence-head">
              <span className="section-kicker">
                <VerifiedOutlinedIcon fontSize="small" />
                <span>Excellence snapshot</span>
              </span>
              <h3>Why teams choose ReadyCool</h3>
            </div>

            <div className="excellence-grid">
              {excellenceStats.map((stat, index) => (
                <article className="excellence-card" key={stat.label}>
                  <div className="excellence-card__icon">{stat.icon}</div>
                  <strong>{stat.formatValue(animatedValues[index])}</strong>
                  <h4>{stat.label}</h4>
                  <p>{stat.detail}</p>
                </article>
              ))}
            </div>

            <div className="hero-visual-stack">
              {excellenceSignals.map((item) => (
                <div className="hero-stack-card" key={item.title}>
                  {item.icon}
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
