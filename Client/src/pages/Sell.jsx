import React, { useRef } from "react";
import "./buySell.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Sell(props) {
	const formRef = useRef();

	const submitAd = (e) => {
		e.preventDefault();
		alert("Your appliance has been listed successfully!");
		formRef.current.reset();
	};

	return (
		<div style={{ background: "#050b14", minHeight: "100vh", color: "#fff"}}>
			<Header showAuth={props.isLogged} />

			<div className="form-container">
				<h2 className="form-header-title">Post Your Ad</h2>
				<form ref={formRef} onSubmit={submitAd} id="sellForm">
					<div className="form-group">
						<label htmlFor="adTitle">Appliance Name / Title</label>
						<input type="text" id="adTitle" placeholder="e.g. LG Refrigerator 260L" required />
					</div>
					<div className="form-group">
						<label htmlFor="price">Expected Price (₹)</label>
						<input type="number" id="price" placeholder="e.g. 10000" required />
					</div>
					<div className="form-group">
						<label htmlFor="condition">Condition</label>
						<select id="condition" required>
							<option value="" disabled defaultValue>Select condition</option>
							<option value="Like New">Like New (0-6 months used)</option>
							<option value="Good">Good (1-2 years used)</option>
							<option value="Fair">Fair (Heavy usage, but working)</option>
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="description">Additional Details</label>
						<textarea id="description" placeholder="Mention warranty, defects, reason for selling..." required></textarea>
					</div>
					<div className="form-group">
						<label htmlFor="image">Upload Image</label>
						<input type="file" id="image" accept="image/*" style={{ padding: 10, background: "transparent", border: "none" }} />
					</div>
					<button type="submit" className="submit-btn">Post Ad Now</button>
				</form>
			</div>

			<Footer />
		</div>
	);
}

export default Sell;
