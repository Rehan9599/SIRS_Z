import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import "../styles/market.css";

function Buy(props) {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	async function getItems() {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const response = await axios.get(`${API_BASE_URL}/buy?id=${props.isLoggedId ?? ""}`);
			const itemArray = (response.data.items || []).map((item) => ({
				id: item.sellID,
				name: item.item_name,
				price: item.price,
				description: item.description,
				imageUrl: item.imageUrl,
				status: item.status || "Available",
				category: item.category,
				brand: item.brand,
				model: item.model,
				city: item.city
			}));
			setProducts(itemArray);
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data?.error || "Unable to load listings right now.");
			} else if (error.request) {
				setErrorMessage("The server did not respond.");
			} else {
				setErrorMessage(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (!props.isLogged) {
			navigate("/login", { replace: true });
			return;
		}
		getItems();
	}, [props.isLogged, props.isLoggedId, navigate]);

	const filteredProducts = products.filter((product) => {
		if (!searchTerm.trim()) {
			return true;
		}

		const search = searchTerm.toLowerCase();
		return [
			product.name,
			product.description,
			product.brand,
			product.model,
			product.city,
			product.category
		]
			.filter(Boolean)
			.some((value) => String(value).toLowerCase().includes(search));
	});

	return (
		<div className="market-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} />

			<main className="market-main">
				<section className="buy-hero">
					<div className="buy-hero__copy">
						<span className="section-kicker">
							<Inventory2OutlinedIcon fontSize="small" />
							<span>Verified inventory</span>
						</span>
						<h1>Commercial refrigeration units ready for a second life.</h1>
						<p>
							Quality-checked listings surfaced through ReadyCool. Privacy-first transactions—you see the item and platform, not the seller.
						</p>
						<div className="buy-search-wrap">
							<input
								className="buy-search"
								type="search"
								placeholder="Search by item, brand, model, city..."
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
							/>
						</div>
					</div>
				</section>

				{errorMessage && <p className="buy-message buy-message--error">{errorMessage}</p>}

				{isLoading && <p className="buy-message">Loading inventory...</p>}

				{!isLoading && !errorMessage && filteredProducts.length === 0 && (
					<p className="buy-empty">No listings available right now. Check back soon!</p>
				)}

				{!isLoading && !errorMessage && filteredProducts.length > 0 && (
					<section className="buy-grid-section">
						<div className="buy-grid">
							{filteredProducts.map((product) => (
								<article className="buy-card" key={product.id}>
									<div className="buy-card__image">
										<img
											src={product.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : "/no-image.png"}
											alt={product.name}
											onError={(e) => (e.target.src = "/no-image.png")}
										/>
									</div>
									<div className="buy-card__body">
										<h3 className="buy-card__title">{product.name}</h3>
										<p className="buy-card__desc">{product.description?.substring(0, 80)}...</p>
										<div className="buy-card__footer">
											<span className="buy-card__price">Rs {product.price}</span>
											<button className="buy-card__btn">
												<LocalShippingOutlinedIcon fontSize="small" />
												Inquire
											</button>
										</div>
										<div className="buy-card__badge">
											<VerifiedOutlinedIcon fontSize="small" />
											<span>Verified</span>
										</div>
									</div>
								</article>
							))}
						</div>
					</section>
				)}
			</main>

			<Footer />
		</div>
	);
}

export default Buy;
