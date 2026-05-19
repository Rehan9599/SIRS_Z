import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import axios from "axios";
import Header from "../components/Header";
import API_BASE_URL from "../api";
import "../styles/auth.css";

const ADMIN_LOGIN = {
	email: "admin@readycool.local",
	password: "Admin@1234"
};

export default function Login(props) {
	const navigate = useNavigate();
	const [role, setRole] = useState("user");
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData]= useState({
		email:"",
		password:""
	});
	const handleChange = (e) => {
		setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.email === ADMIN_LOGIN.email && formData.password === ADMIN_LOGIN.password) {
			props.setIsLogged(true);
			props.setIsLoggedId(0);
			if (props.setIsAdmin) {
				props.setIsAdmin(true);
			}
			if (props.setIsWorker) {
				props.setIsWorker(false);
			}
			if (props.setUserName) {
				props.setUserName("Admin");
			}
			setErrorMessage("");
			navigate("/admin/dashboard", { replace: true });
			return;
		}

		try {
			const response = await axios.post(
				`${API_BASE_URL}/login`, {
					email: formData.email,
					password: formData.password,
					role: role
				}
			);
			if(response.data.message === "login_success"){
				props.setIsLogged(true);
				props.setIsLoggedId(response.data.userId);
				if (props.setIsAdmin) {
					props.setIsAdmin(false);
				}
				if (props.setUserName) {
					props.setUserName(response.data.name || "");
				}
				if (props.setIsWorker) {
					props.setIsWorker(response.data.isWorker || false);
				}
				if (props.setNeedsWorkerOnboarding) {
					props.setNeedsWorkerOnboarding(response.data.needsOnboarding || false);
				}
				setErrorMessage("");
				
				// If worker needs onboarding, go to onboarding page
				if (response.data.isWorker && response.data.needsOnboarding) {
					navigate("/worker/onboard");
				} else if (response.data.isWorker) {
					navigate("/worker/dashboard");
				} else {
					navigate("/");
				}
			}else{
				setFormData({
		        email:"",
		        password:""
	            });
				setErrorMessage(response.data?.message || "Invalid email or password.");
			}
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data?.message || "Invalid email or password.");
			} else if (error.request) {
				setErrorMessage("The server did not respond.");
			} else {
				setErrorMessage(error.message);
			}
		}
	};

	return (
		<div className="auth-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} page="login" userName={props.userName} isAdmin={props.isAdmin} isWorker={props.isWorker} />
			<main className="auth-shell">
				<aside className="auth-visual">
					<div className="auth-visual__title">
						<span className="section-kicker">
							<VerifiedUserOutlinedIcon fontSize="small" />
							<span>Secure login</span>
						</span>
						<h1>Welcome back to ReadyCool</h1>
						<p>
							Log in to manage listings, browse verified inventory, and handle service or tender requests from one central account.
						</p>
					</div>

					<div className="auth-points">
						<div className="auth-point">
							<SupportAgentOutlinedIcon />
							<div>
								<strong>Built for business users</strong>
								<span>Access the buy, sell, and commercial flows from one account.</span>
							</div>
						</div>
						<div className="auth-point">
							<VerifiedUserOutlinedIcon />
							<div>
								<strong>Private resale flow</strong>
								<span>Seller identity stays hidden when items are listed for buyers.</span>
							</div>
						</div>
					</div>
				</aside>

				<section className="auth-card">
					<div className="auth-card__top">
						<h2>Sign in</h2>
						<p>Use your account to continue to the marketplace and commercial desk.</p>
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
								<span className="auth-role-desc">Access marketplace & services</span>
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
								<span className="auth-role-desc">View assignments & tasks</span>
							</label>
						</div>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<div className="auth-field">
							<label className="auth-label" htmlFor="login-email">Email</label>
							<div className="auth-input-wrap">
								<AlternateEmailOutlinedIcon className="auth-input-icon" fontSize="small" />
								<input
									className="auth-input"
									id="login-email"
									type="email"
									name="email"
									placeholder="you@example.com"
									required
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="login-password">Password</label>
							<div className="auth-input-wrap">
								<LockOutlinedIcon className="auth-input-icon" fontSize="small" />
								<input
									className="auth-input"
									id="login-password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter password"
									required
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

						<button type="submit" className="auth-submit">Login</button>

						{errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

						<div className="auth-footer">
							<span>Need an account?</span>
							<Link className="auth-link" to="/signup">Sign up now</Link>
						</div>
					</form>
				</section>
			</main>
		</div>
	);
}
