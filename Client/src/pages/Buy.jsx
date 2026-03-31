import React, { useState } from "react";
import "./buySell.css";
import Header from "../components/Header";
import Footer from"../components/Footer";
const products = [
	{
		title: "Double Door Refrigerator",
		price: "₹12,500",
		details: "LG 260L Frost Free. 2 years used. Excellent cooling, slight scratch on the side. Reason for selling: Upgrading.",
		image: "[Fridge Image]"
	},
	{
		title: "Washing Machine (Front Load)",
		price: "₹15,000",
		details: "Samsung 6.5kg Fully Automatic. 1.5 years used. Works perfectly, motor still under warranty.",
		image: "[Washer Image]"
	},
	{
		title: "Microwave Oven",
		price: "₹3,200",
		details: "IFB 20L Convection. 3 years used. Good condition, includes baking tray.",
		image: "[Microwave Image]"
	}
];

function Buy(props) {
	const [modal, setModal] = useState({ open: false, product: null });

	const openModal = (product) => {
		setModal({ open: true, product });
	};
	const closeModal = () => {
		setModal({ open: false, product: null });
	};

	return (
		<div style={{ background: "#050b14", minHeight: "100vh", color: "#fff"}}>
			<Header showAuth={props.isLogged} />
			<div className="buy-sell-container">
				<div className="product-grid">
					{products.map((p, i) => (
						<div className="product-card" key={i} onClick={() => openModal(p)}>
							<div className="product-image">{p.image}</div>
							<div className="product-info">
								<div className="product-price">{p.price}</div>
								<div className="product-title">{p.title}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<section className="info-section">
				<h2 className="section-title">Why Buy From Us?</h2>
				<div className="features-grid">
					<div className="feature-card">Quality Checked</div>
					<div className="feature-card">6 Months Warranty</div>
					<div className="feature-card">Free Delivery</div>
					<div className="feature-card">Easy Returns</div>
				</div>
			</section>

			<Footer />

			{/* Modal */}
			<div className={modal.open ? "modal-overlay active" : "modal-overlay"}>
				{modal.product && (
					<div className="modal-content">
						<span className="close-btn" onClick={closeModal}>&times;</span>
						<h2>{modal.product.price}</h2>
						<h3>{modal.product.title}</h3>
						<hr style={{ border: 0, height: 1, background: "#2a3b52", margin: "15px 0" }} />
						<h4>Details:</h4>
						<p style={{ color: "#d1d8e0", lineHeight: 1.5 }}>{modal.product.details}</p>
						<button className="modal-btn">Chat with Seller</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Buy;
