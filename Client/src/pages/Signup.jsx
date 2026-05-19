
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import API_BASE_URL from "../api";
import "../styles/auth.css";

export default function Signup(props) {
	const navigate = useNavigate();
	const [role, setRole] = useState("user");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		companyName: "",
		jobRole: "",
		city: "",
		addressLine: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${API_BASE_URL}/signup`, {
					name: formData.name,
					email: formData.email,
					password: formData.password,
					phone: formData.phone,
					companyName: formData.companyName,
					jobRole: formData.jobRole,
					city: formData.city,
					addressLine: formData.addressLine,
					role: role
				}
			);
			if (response.status === 201 || response.data.message === "signup_success") {
				if (role === "worker") {
					// Worker needs to complete onboarding after signup
					navigate("/login");
				} else {
					navigate("/login");
				}
				return;
			}
			setErrorMessage(response.data?.message || "Unable to create your account.");
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data?.message || "Unable to create your account.");
			} else if (error.request) {
				setErrorMessage("The server did not respond.");
			} else {
				setErrorMessage(error.message);
			}
		}
	};

	return (
		<div className="auth-page">
			<Header page="signup" onLogout={props.onLogout} />
			<main className="auth-shell">
				<aside className="auth-visual">
					<div className="auth-visual__title">
						<span className="section-kicker">
							<ShieldOutlinedIcon fontSize="small" />
							<span>Join ReadyCool</span>
						</span>
						<h1>Create your account</h1>
						<p>
							Set up a customer account to sell equipment, browse inventory, and request service or tender support.
						</p>
					</div>

					<div className="auth-points">
						<div className="auth-point">
							<VerifiedUserOutlinedIcon />
							<div>
								<strong>Secure access</strong>
								<span>Your login is used for listings, service, and commercial requests.</span>
							</div>
						</div>
						<div className="auth-point">
							<ShieldOutlinedIcon />
							<div>
								<strong>Privacy-first resale</strong>
								<span>Buyers never see the original seller when equipment moves through the platform.</span>
							</div>
						</div>
					</div>
				</aside>

				<section className="auth-card">
					<div className="auth-card__top">
						<h2>Sign up</h2>
						<p>Create the account you will use for the marketplace and service desk.</p>
					</div>

					{/* Role Selector */}
					<div className="auth-role-selector">
						<div className="auth-role-label">Account type</div>
						<div className="auth-role-options">
							<label className={`auth-role-option ${role === "user" ? "active" : ""}`}>
								<input
									type="radio"
									name="accountRole"
									value="user"
									checked={role === "user"}
									onChange={(e) => setRole(e.target.value)}
								/>
								<span className="auth-role-text">Customer</span>
								<span className="auth-role-desc">Buy, sell, and request services</span>
							</label>
							<label className={`auth-role-option ${role === "worker" ? "active" : ""}`}>
								<input
									type="radio"
									name="accountRole"
									value="worker"
									checked={role === "worker"}
									onChange={(e) => setRole(e.target.value)}
								/>
								<span className="auth-role-text">Service Worker</span>
								<span className="auth-role-desc">Handle service requests and assignments</span>
							</label>
						</div>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<div className="auth-field">
							<label className="auth-label" htmlFor="signup-name">Full name</label>
							<div className="auth-input-wrap">
								<PersonOutlineOutlinedIcon className="auth-input-icon" fontSize="small" />
								<input
									className="auth-input"
									id="signup-name"
									type="text"
									name="name"
									placeholder="John Doe"
									required
									value={formData.name}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="auth-row">
							<div className="auth-field">
								<label className="auth-label" htmlFor="signup-phone">Phone</label>
								<div className="auth-input-wrap">
									<PersonOutlineOutlinedIcon className="auth-input-icon" fontSize="small" />
									<input
										className="auth-input"
										id="signup-phone"
										type="tel"
										name="phone"
										placeholder="+91 98765 43210"
										required
										value={formData.phone}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="auth-field">
								<label className="auth-label" htmlFor="signup-city">City</label>
								<div className="auth-input-wrap">
									<PersonOutlineOutlinedIcon className="auth-input-icon" fontSize="small" />
									<input
										className="auth-input"
										id="signup-city"
										type="text"
										name="city"
										placeholder="Mumbai"
										required
										value={formData.city}
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>

						<div className="auth-row">
							<div className="auth-field">
								<label className="auth-label" htmlFor="signup-company">Company (optional)</label>
								<div className="auth-input-wrap">
									<PersonOutlineOutlinedIcon className="auth-input-icon" fontSize="small" />
									<input
										className="auth-input"
										id="signup-company"
										type="text"
										name="companyName"
										placeholder="ABC Cold Chain Pvt Ltd"
										value={formData.companyName}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="auth-field">
								<label className="auth-label" htmlFor="signup-role">Role (optional)</label>
								<div className="auth-input-wrap">
									<PersonOutlineOutlinedIcon className="auth-input-icon" fontSize="small" />
									<input
										className="auth-input"
										id="signup-role"
										type="text"
										name="jobRole"
										placeholder="Facility Manager"
										value={formData.jobRole}
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="signup-address">Address (optional)</label>
							<div className="auth-input-wrap">
								<PersonOutlineOutlinedIcon className="auth-input-icon" fontSize="small" />
								<input
									className="auth-input"
									id="signup-address"
									type="text"
									name="addressLine"
									placeholder="Site address / locality"
									value={formData.addressLine}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="signup-email">Email</label>
							<div className="auth-input-wrap">
								<AlternateEmailOutlinedIcon className="auth-input-icon" fontSize="small" />
								<input
									className="auth-input"
									id="signup-email"
									type="email"
									name="email"
									placeholder="you@example.com"
									required
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="signup-password">Password</label>
							<div className="auth-input-wrap">
								<LockOutlinedIcon className="auth-input-icon" fontSize="small" />
								<input
									className="auth-input"
									id="signup-password"
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="Create password"
									required
									value={formData.password}
									onChange={handleChange}
								/>
								<button
									type="button"
									className="auth-toggle"
									onClick={() => setShowPassword((value) => !value)}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
									<span>{showPassword ? "Hide" : "Show"}</span>
								</button>
							</div>
						</div>

						<button type="submit" className="auth-submit">Create account</button>

						{errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

						<div className="auth-footer">
							<span>Already have an account?</span>
							<Link className="auth-link" to="/login">Log in</Link>
						</div>
					</form>
				</section>
			</main>
		</div>
	);
}