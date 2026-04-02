import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import "../styles/market.css";

function Sell(props) {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState({ text: "", type: "" });
	const [formData, setFormData] = useState({
		adTitle: "",
		category: "",
		brand: "",
		model: "",
		manufactureYear: "",
		city: "",
		price: "",
		warrantyMonths: "",
		negotiable: false,
		condition: "",
		description: "",
		image: ""
	});

	const handleChange = (event) => {
		const { name, value, type, files } = event.target;
		setFormData((previous) => ({
			...previous,
			[name]: type === "file" ? files[0] : type === "checkbox" ? event.target.checked : value
		}));
	};

	useEffect(() => {
		if (!props.isLogged) {
			navigate("/login", { replace: true });
		}
	}, [props.isLogged, navigate]);

	const submitAd = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setFeedback({ text: "", type: "" });
		try {
			const payload = new FormData();
			payload.append("id", props.isLoggedId ?? "");
			payload.append("item", formData.adTitle);
			payload.append("category", formData.category);
			payload.append("brand", formData.brand);
			payload.append("model", formData.model);
			payload.append("manufactureYear", formData.manufactureYear);
			payload.append("city", formData.city);
			payload.append("price", formData.price);
			payload.append("warrantyMonths", formData.warrantyMonths);
			payload.append("negotiable", String(formData.negotiable));
			payload.append("status", formData.condition);
			payload.append("description", formData.description);
			payload.append("quantity", "1");
			if (formData.image) {
				payload.append("image", formData.image);
			}

			const response = await axios.post(`${API_BASE_URL}/sell`, payload);
			setFeedback({
				text: response.data?.message || "Listing submitted successfully.",
				type: "success"
			});
			setFormData({
				adTitle: "",
				category: "",
				brand: "",
				model: "",
				manufactureYear: "",
				city: "",
				price: "",
				warrantyMonths: "",
				negotiable: false,
				condition: "",
				description: "",
				image: ""
			});
		} catch (error) {
			const message = error.response?.data?.error || error.response?.data?.message || error.message || "Unable to submit listing right now.";
			setFeedback({ text: message, type: "error" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="market-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} />

			<main className="market-section">
				<section className="market-hero">
					<div className="market-copy">
						<span className="section-kicker">
							<SellOutlinedIcon fontSize="small" />
							<span>Sell your unit</span>
						</span>
						<h1>List equipment with ReadyCool and keep the resale private.</h1>
						<p>
							Upload the details, add a photo, and let us manage the resale flow so the buyer never sees the original seller.
						</p>
						<div className="market-actions">
							<Link className="action-button action-button--primary" to="/buy">
								<ArrowForwardRoundedIcon fontSize="small" />
								<span>Browse inventory</span>
							</Link>
							<Link className="action-button action-button--ghost" to="/commercial">
								<SecurityOutlinedIcon fontSize="small" />
								<span>Commercial support</span>
							</Link>
						</div>
					</div>

					<div className="market-panel">
						<div className="market-panel__top">
							<h2 className="market-panel__title">Listing checklist</h2>
						</div>
						<div className="commercial-line">
							<PhotoCameraOutlinedIcon />
							<div>
								<strong>Add a clear photo</strong>
								<span>Images help buyers understand the condition quickly.</span>
							</div>
						</div>
						<div className="commercial-line">
							<AssignmentTurnedInOutlinedIcon />
							<div>
								<strong>Describe the unit honestly</strong>
								<span>Share the condition, usage, and any important notes.</span>
							</div>
						</div>
						<div className="commercial-line">
							<SecurityOutlinedIcon />
							<div>
								<strong>We handle privacy</strong>
								<span>The original seller identity is hidden from the buyer.</span>
							</div>
						</div>
						<div className="commercial-line">
							<CheckCircleOutlinedIcon />
							<div>
								<strong>Validated after submission</strong>
								<span>Your listing is sent to the ReadyCool marketplace flow.</span>
							</div>
						</div>
					</div>
				</section>

				<section className="market-form">
					<div className="market-form__heading">
						<h2>Post your listing</h2>
						<p>Use the form below to submit equipment for anonymous resale.</p>
					</div>

					<form onSubmit={submitAd}>
						<div className="field-group">
							<label htmlFor="category">Category</label>
							<select className="field-select" id="category" name="category" required value={formData.category} onChange={handleChange}>
								<option value="" disabled>Select category</option>
								<option value="Refrigerator">Refrigerator</option>
								<option value="Deep Freezer">Deep Freezer</option>
								<option value="Display Chiller">Display Chiller</option>
								<option value="Cold Room Unit">Cold Room Unit</option>
								<option value="Air Conditioner">Air Conditioner</option>
							</select>
						</div>

						<div className="field-grid-2">
							<div className="field-group">
								<label htmlFor="brand">Brand</label>
								<input className="field-input" type="text" id="brand" name="brand" placeholder="e.g. Blue Star" required value={formData.brand} onChange={handleChange} />
							</div>
							<div className="field-group">
								<label htmlFor="model">Model</label>
								<input className="field-input" type="text" id="model" name="model" placeholder="Model number" required value={formData.model} onChange={handleChange} />
							</div>
						</div>

						<div className="field-grid-2">
							<div className="field-group">
								<label htmlFor="manufactureYear">Manufacture year</label>
								<input className="field-input" type="number" id="manufactureYear" name="manufactureYear" placeholder="e.g. 2022" min="1995" max="2099" required value={formData.manufactureYear} onChange={handleChange} />
							</div>
							<div className="field-group">
								<label htmlFor="city">City</label>
								<input className="field-input" type="text" id="city" name="city" placeholder="e.g. Pune" required value={formData.city} onChange={handleChange} />
							</div>
						</div>

						<div className="field-group">
							<label htmlFor="adTitle">Appliance name / title</label>
							<input className="field-input" type="text" id="adTitle" name="adTitle" placeholder="e.g. LG Refrigerator 260L" required value={formData.adTitle} onChange={handleChange} />
						</div>

						<div className="field-grid-2">
							<div className="field-group">
								<label htmlFor="price">Expected price (₹)</label>
								<input className="field-input" type="number" id="price" name="price" placeholder="e.g. 10000" required value={formData.price} onChange={handleChange} />
							</div>
							<div className="field-group">
								<label htmlFor="warrantyMonths">Warranty left (months)</label>
								<input className="field-input" type="number" id="warrantyMonths" name="warrantyMonths" placeholder="0 if none" min="0" value={formData.warrantyMonths} onChange={handleChange} />
							</div>
						</div>

						<div className="field-group">
							<label htmlFor="condition">Condition</label>
							<select className="field-select" id="condition" name="condition" required value={formData.condition} onChange={handleChange}>
								<option value="" disabled>Select condition</option>
								<option value="Like New">Like New (0-6 months used)</option>
								<option value="Good">Good (1-2 years used)</option>
								<option value="Fair">Fair (working, with visible use)</option>
							</select>
						</div>

						<div className="field-group">
							<label htmlFor="description">Additional details</label>
							<textarea className="field-textarea" id="description" name="description" placeholder="Mention warranty, defects, reason for selling..." required value={formData.description} onChange={handleChange} />
						</div>

						<label className="field-check" htmlFor="negotiable">
							<input id="negotiable" type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} />
							<span>Price is negotiable</span>
						</label>

						<div className="field-group">
							<label htmlFor="image">Upload image</label>
							<input className="field-upload" type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
						</div>

						<button type="submit" className="market-submit" disabled={isSubmitting}>
							{isSubmitting ? "Submitting..." : "Post ad now"}
						</button>

						{feedback.text && (
							<p className={feedback.type === "error" ? "market-message market-message--error" : "market-message"}>
								{feedback.text}
							</p>
						)}
					</form>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default Sell;
