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
	const [selectedListing, setSelectedListing] = useState(null);
	const [isInquiryOpen, setIsInquiryOpen] = useState(false);
	const [inquiryMessage, setInquiryMessage] = useState("Hi! I'm interested in this unit. Please share next steps for a private, anonymous inquiry.");
	const [inquirySubmitting, setInquirySubmitting] = useState(false);
	const [inquiryFeedback, setInquiryFeedback] = useState({ text: "", type: "" });
	const [actionMessage, setActionMessage] = useState({ text: "", type: "" });

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
				condition: item.listingCondition || item.condition || "Condition unknown",
				verificationStatus: item.verificationStatus || "Pending Review",
				photoComplete: Boolean(item.photoComplete),
				specComplete: Boolean(item.specComplete),
				modelCategoryMatch: Boolean(item.modelCategoryMatch),
				manualCheckList: item.manualCheckList || null,
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

	const sendInquiry = async () => {
		if (!selectedListing) return;
		setInquirySubmitting(true);
		setInquiryFeedback({ text: "", type: "" });
		setActionMessage({ text: "", type: "" });
		try {
			await axios.post(`${API_BASE_URL}/inquiries`, {
				buyerId: props.isLoggedId,
				sellId: selectedListing.id,
				message: inquiryMessage
			});

			setInquiryFeedback({ text: "Inquiry sent.", type: "success" });
			setActionMessage({ text: "Inquiry sent. Seller gets routed next steps privately.", type: "success" });
			setIsInquiryOpen(false);
			setSelectedListing(null);
			setInquiryMessage("Hi! I'm interested in this unit. Please share next steps for a private, anonymous inquiry.");
			getItems();
		} catch (error) {
			const message =
				error.response?.data?.message ||
				error.response?.data?.error ||
				error.message ||
				"Unable to send inquiry right now.";
			setInquiryFeedback({ text: message, type: "error" });
			setActionMessage({ text: message, type: "error" });
		} finally {
			setInquirySubmitting(false);
		}
	};

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
							<span>Marketplace listings</span>
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
				{actionMessage.text && (
					<p className={actionMessage.type === "error" ? "buy-message buy-message--error" : "buy-message"}>
						{actionMessage.text}
					</p>
				)}

				{isLoading && <p className="buy-message">Loading inventory...</p>}

				{!isLoading && !errorMessage && filteredProducts.length === 0 && (
					<p className="buy-empty">No listings available right now. Check back soon!</p>
				)}

				{!isLoading && !errorMessage && filteredProducts.length > 0 && (
					<section className="buy-grid-section">
						<div className="buy-grid">
							{filteredProducts.map((product) => {
								const signals = [
									product.photoComplete ? "Photo complete" : "Photo missing",
									product.specComplete ? "Specs complete" : "Specs incomplete",
									product.modelCategoryMatch ? "Model/category match" : "Model/category check"
								];

								const verificationLabel =
									product.verificationStatus === "Verified"
										? "Verified"
										: product.verificationStatus === "Rejected"
											? "Rejected"
											: "Pending review";

								const badgeStyle =
									product.verificationStatus === "Verified"
										? { background: "rgba(93, 242, 176, 0.1)", color: "#5df2b0" }
										: product.verificationStatus === "Rejected"
											? { background: "rgba(255, 107, 107, 0.12)", color: "#ff6b6b" }
											: { background: "rgba(255, 177, 92, 0.12)", color: "#ffb15c" };

								return (
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
											<p className="buy-card__desc">
												Condition: {product.condition}. {signals.slice(0, 2).join(" • ")}.
												{" "}
												{product.description?.substring(0, 80)}...
											</p>
											<div className="buy-card__footer">
												<span className="buy-card__price">Rs {product.price}</span>
												<button
													type="button"
													className="buy-card__btn"
													onClick={() => {
														setSelectedListing(product);
														setIsInquiryOpen(true);
														setInquiryFeedback({ text: "", type: "" });
														setInquiryMessage(
															`Hi! I'm interested in ${product.name}. Please share next steps for a private, anonymous inquiry.`
														);
													}}
												>
													<LocalShippingOutlinedIcon fontSize="small" />
													Inquire
												</button>
											</div>
											<div className="buy-card__badge" style={badgeStyle}>
												<VerifiedOutlinedIcon fontSize="small" />
												<span>{verificationLabel}</span>
											</div>
										</div>
									</article>
								);
							})}
						</div>
					</section>
				)}
			</main>

			<div
				className={`market-modal-overlay ${isInquiryOpen ? "active" : ""}`}
				role="dialog"
				aria-modal="true"
				style={{ pointerEvents: isInquiryOpen ? "auto" : "none" }}
			>
				<div className="market-modal">
					<button
						type="button"
						className="market-modal__close"
						aria-label="Close inquiry modal"
						onClick={() => {
							setIsInquiryOpen(false);
							setSelectedListing(null);
						}}
					>
						×
					</button>

					<h2 className="market-modal__title">Send a private inquiry</h2>
					{selectedListing && (
						<div className="market-info-strip">
							<h3 style={{ margin: 0 }}> {selectedListing.name}</h3>
							<p style={{ margin: "0.5rem 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
								Condition: {selectedListing.condition} • Verification: {selectedListing.verificationStatus}
							</p>
						</div>
					)}

					<div className="market-modal__body">
						<div className="field-group" style={{ marginBottom: 0 }}>
							<label htmlFor="inquiry-message">Message</label>
							<textarea
								id="inquiry-message"
								className="field-textarea"
								value={inquiryMessage}
								onChange={(e) => setInquiryMessage(e.target.value)}
								placeholder="Write a short message..."
							/>
						</div>

						<button
							type="button"
							className="market-submit"
							disabled={inquirySubmitting || !inquiryMessage.trim()}
							onClick={sendInquiry}
						>
							{inquirySubmitting ? "Sending..." : "Send inquiry"}
						</button>

						{inquiryFeedback.text && (
							<p className={inquiryFeedback.type === "error" ? "buy-message buy-message--error" : "buy-message"}>
								{inquiryFeedback.text}
							</p>
						)}
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default Buy;
