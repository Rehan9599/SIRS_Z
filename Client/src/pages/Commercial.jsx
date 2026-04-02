import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home/Home.css";
import "../styles/commercial.css";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

function Commercial(props) {
	return (
		<div className="commercial-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} page="commercial" />

			<main className="commercial-flow">
				<section className="commercial-hero">
					<div className="commercial-copy">
						<span className="section-kicker">
							<StorefrontOutlinedIcon fontSize="small" />
							<span>Commercial service desk</span>
						</span>
						<h1>
							Tenders, AMC, and <span>business refrigeration care</span>
						</h1>
						<p>
							We handle company service requests, regular maintenance, and tender-based work for commercial refrigeration and allied assets. The same workflow also supports resale and procurement.
						</p>
						<div className="commercial-actions">
							<Link className="action-button action-button--primary" to="/sell">
								<BusinessCenterOutlinedIcon fontSize="small" />
								<span>List equipment</span>
							</Link>
							<Link className="action-button action-button--ghost" to="/buy">
								<HandshakeOutlinedIcon fontSize="small" />
								<span>Browse inventory</span>
							</Link>
						</div>
					</div>

					<div className="commercial-panel">
						<div className="section-kicker">
							<SupportAgentOutlinedIcon fontSize="small" />
							<span>What we handle</span>
						</div>
						<div className="commercial-panel__list">
							<div className="commercial-line">
								<VerifiedOutlinedIcon />
								<div>
									<strong>Scheduled service visits</strong>
									<span>Repairs, preventive maintenance, and on-site support for commercial equipment.</span>
								</div>
							</div>
							<div className="commercial-line">
								<LocalShippingOutlinedIcon />
								<div>
									<strong>Anonymous resale handling</strong>
									<span>Listings are shown to buyers without exposing the original seller identity.</span>
								</div>
							</div>
							<div className="commercial-line">
								<HandshakeOutlinedIcon />
								<div>
									<strong>Tender and AMC support</strong>
									<span>Contract-driven work, procurement help, and recurring service support.</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="commercial-grid">
					<article className="commercial-card">
						<VerifiedOutlinedIcon />
						<h3>1. Share requirements</h3>
						<p>Tell us the site, equipment, and urgency. We review the scope and route it correctly.</p>
					</article>
					<article className="commercial-card">
						<BusinessCenterOutlinedIcon />
						<h3>2. We coordinate</h3>
						<p>Our team schedules the service call or prepares the listing/procurement path.</p>
					</article>
					<article className="commercial-card">
						<HandshakeOutlinedIcon />
						<h3>3. Delivery or service</h3>
						<p>We complete the maintenance work or handle the resale flow privately.</p>
					</article>
					<article className="commercial-card">
						<SupportAgentOutlinedIcon />
						<h3>4. Ongoing support</h3>
						<p>Continue with AMC, future repairs, or new equipment procurement after the first job.</p>
					</article>
				</section>

				<section className="commercial-cta">
					<h2>Ready for a commercial quote?</h2>
					<p>
						Use the service desk for tenders, regular maintenance, or resale support. ReadyCool keeps the customer flow clean and the seller data private.
					</p>
					<div className="commercial-actions">
						<Link className="action-button action-button--primary" to="/commercial">
							<span>Open commercial desk</span>
							<ArrowForwardRoundedIcon fontSize="small" />
						</Link>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default Commercial;