import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home/Home.css";
import "../styles/commercial.css";
import "../styles/market.css";
import axios from "axios";
import API_BASE_URL from "../api";
import React, { useEffect, useState } from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

function Commercial(props) {
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState({ text: "", type: "" });
	const [formData, setFormData] = useState({
		requestType: "Service Visit",
		title: "",
		equipmentCategory: "",
		brand: "",
		model: "",
		city: "",
		urgency: "Medium",
		notes: "",
		image: null
	});

	useEffect(() => {
		if (!props.isLogged) {
			navigate("/login", { replace: true });
		}
	}, [props.isLogged, navigate]);

	const handleChange = (event) => {
		const { name, value, type, files } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "file" ? files[0] : value
		}));
	};

	const submitRequest = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setMessage({ text: "", type: "" });

		try {
			const payload = new FormData();
			payload.append("userId", props.isLoggedId ?? "");
			payload.append("requestType", formData.requestType);
			payload.append("title", formData.title);
			payload.append("equipmentCategory", formData.equipmentCategory);
			payload.append("brand", formData.brand);
			payload.append("model", formData.model);
			payload.append("city", formData.city);
			payload.append("urgency", formData.urgency);
			payload.append("notes", formData.notes);
			if (formData.image) payload.append("image", formData.image);

			await axios.post(`${API_BASE_URL}/service-requests`, payload);
			setMessage({ text: "Request submitted. We'll route it from the ReadyCool desk.", type: "success" });
			navigate("/dashboard", { replace: true });
		} catch (error) {
			const errorText =
				error.response?.data?.message ||
				error.response?.data?.error ||
				error.message ||
				"Unable to submit request right now.";
			setMessage({ text: errorText, type: "error" });
		} finally {
			setIsSubmitting(false);
		}
	};

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

				<section className="market-form">
					<div className="market-form__heading">
						<h2>Create a service request</h2>
						<p>Use the same desk flow for Service visits, AMC, and Tender-style work.</p>
					</div>

					<form onSubmit={submitRequest}>
						<div className="field-group">
							<label htmlFor="requestType">Request type</label>
							<select
								className="field-select"
								id="requestType"
								name="requestType"
								value={formData.requestType}
								onChange={handleChange}
							>
								<option value="Service Visit">Service Visit</option>
								<option value="AMC">AMC</option>
								<option value="Tender">Tender</option>
							</select>
						</div>

						<div className="field-group">
							<label htmlFor="title">What do you need?</label>
							<input
								className="field-input"
								id="title"
								name="title"
								type="text"
								required
								placeholder="e.g. Compressor not cooling (urgent), Pune site"
								value={formData.title}
								onChange={handleChange}
							/>
						</div>

						<div className="field-grid-2">
							<div className="field-group">
								<label htmlFor="equipmentCategory">Equipment category</label>
								<select
									className="field-select"
									id="equipmentCategory"
									name="equipmentCategory"
									value={formData.equipmentCategory}
									onChange={handleChange}
								>
									<option value="" disabled>
										Select category
									</option>
									<option value="Refrigerator">Refrigerator</option>
									<option value="Deep Freezer">Deep Freezer</option>
									<option value="Display Chiller">Display Chiller</option>
									<option value="Cold Room Unit">Cold Room Unit</option>
									<option value="Air Conditioner">Air Conditioner</option>
								</select>
							</div>

							<div className="field-group">
								<label htmlFor="urgency">Urgency</label>
								<select className="field-select" id="urgency" name="urgency" value={formData.urgency} onChange={handleChange}>
									<option value="Low">Low</option>
									<option value="Medium">Medium</option>
									<option value="High">High</option>
								</select>
							</div>
						</div>

						<div className="field-grid-2">
							<div className="field-group">
								<label htmlFor="brand">Brand</label>
								<input className="field-input" id="brand" name="brand" type="text" value={formData.brand} onChange={handleChange} placeholder="e.g. Blue Star" />
							</div>
							<div className="field-group">
								<label htmlFor="model">Model</label>
								<input className="field-input" id="model" name="model" type="text" value={formData.model} onChange={handleChange} placeholder="Model number" />
							</div>
						</div>

						<div className="field-group">
							<label htmlFor="city">Site city</label>
							<input className="field-input" id="city" name="city" type="text" value={formData.city} onChange={handleChange} required placeholder="e.g. Pune" />
						</div>

						<div className="field-group">
							<label htmlFor="notes">Notes</label>
							<textarea className="field-textarea" id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Add symptoms, installation details, warranty info, timeline..." />
						</div>

						<div className="field-group">
							<label htmlFor="image">Optional image</label>
							<input className="field-upload" type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
						</div>

						<button type="submit" className="market-submit" disabled={isSubmitting}>
							{isSubmitting ? "Submitting..." : "Submit request"}
						</button>

						{message.text && (
							<p className={message.type === "error" ? "market-message market-message--error" : "market-message"}>{message.text}</p>
						)}
					</form>
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