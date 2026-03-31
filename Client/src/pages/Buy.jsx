import React, { useState,useEffect} from "react";
import "./buySell.css";
import axios from "axios";
import Header from "../components/Header";
import Footer from"../components/Footer";


function Buy(props) {
	const [modal, setModal] = useState({ open: false, product: null });
	const [products, setProducts]= useState([]);
	const openModal = (product) => {
		setModal({ open: true, product });
	};
	const closeModal = () => {
		setModal({ open: false, product: null });
	};

	async function getItems(){
		try {
			const response = await axios.get(
				`http://localhost:5000/buy?id=${props.isLoggedId}`,{}
			);
			const itemArray=response.data.items.map((i,j) => ({
				key:j,
				title: i.item_name,
		        price: "Rs "+i.price,
		        details: i.description,
		        image: i.imageUrl
			}));
			setProducts(itemArray);
			console.log("items:", response.data);
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
	useEffect(()=>{
       getItems();
	},[]);
	
	return (
		<div style={{ background: "#050b14", minHeight: "100vh", color: "#fff"}}>
			<Header showAuth={props.isLogged} />
			<div className="buy-sell-container">
				<div className="product-grid">
					{products.map((p, i) => (
						<div className="product-card" key={i} onClick={() => openModal(p)}>
							<div className="product-image">
								<img
									src={p.image ? `http://localhost:5000${p.image}` : "/no-image.png"}
									alt={p.title}
									style={{ maxWidth: "100%", maxHeight: "200px" }}
								/>
							</div>
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
