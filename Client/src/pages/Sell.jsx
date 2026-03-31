import React, { useRef, useState } from "react";
import "./buySell.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

function Sell(props) {
	const formRef = useRef();

	const [formData, setFormData] =useState({
		adTitle: "",
		price: "",
		condition: "",
		description: "",
		image: ""
	});

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "file" ? files[0] : value
		}));
	};
	  
	const submitAd = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/sell",{
				id: props.isLoggedId,
				item: formData.adTitle,
				price: formData.price,
				status: formData.condition,
				description: formData.description,
				quantity: 1,
				image: formData.image
			},
			{ headers: { 'Content-Type': 'multipart/form-data' } }
			);
			console.log("sold:", response.data);
		} catch (error) {
			if (error.response) {
				console.log("Server responded with error:", error.response.data, error.response.status);
			} else if (error.request) {
				console.log("No response received:", error.request);
			} else {
				console.log("Error setting up request:", error.message);
			}
		}
	};

	return (
		<div style={{ background: "#050b14", minHeight: "100vh", color: "#fff"}}>
			<Header showAuth={props.isLogged} />

			<div className="form-container">
				<h2 className="form-header-title">Post Your Ad</h2>
				<form ref={formRef} onSubmit={submitAd} id="sellForm">
					<div className="form-group">
						<label htmlFor="adTitle">Appliance Name / Title</label>
						<input
							type="text"
							id="adTitle"
							name="adTitle"
							placeholder="e.g. LG Refrigerator 260L"
							required
							value={formData.adTitle}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="price">Expected Price (₹)</label>
						<input
							type="number"
							id="price"
							name="price"
							placeholder="e.g. 10000"
							required
							value={formData.price}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="condition">Condition</label>
						<select
							id="condition"
							name="condition"
							required
							value={formData.condition}
							onChange={handleChange}
						>
							<option value="" disabled>Select condition</option>
							<option value="Like New">Like New (0-6 months used)</option>
							<option value="Good">Good (1-2 years used)</option>
							<option value="Fair">Fair (Heavy usage, but working)</option>
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="description">Additional Details</label>
						<textarea
							id="description"
							name="description"
							placeholder="Mention warranty, defects, reason for selling..."
							required
							value={formData.description}
							onChange={handleChange}
						></textarea>
					</div>
					<div className="form-group">
						<label htmlFor="image">Upload Image</label>
						<input
							type="file"
							id="image"
							name="image"
							accept="image/*"
							style={{ padding: 10, background: "transparent", border: "none" }}
							onChange={handleChange}
						/>
					</div>
					<button type="submit" className="submit-btn">Post Ad Now</button>
				</form>
			</div>

			<Footer />
		</div>
	);
}

export default Sell;
