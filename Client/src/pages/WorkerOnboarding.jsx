import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import API_BASE_URL from "../api";
import "../styles/auth.css";

export default function WorkerOnboarding(props) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		role: "Service Technician",
		qualifications: "",
		experience_years: "",
		certifications: "",
		availability_status: "Full-time"
	});
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!props.isLogged || !props.isLoggedId) {
			navigate("/login", { replace: true });
			return;
		}

		if (!props.isWorker) {
			navigate("/dashboard", { replace: true });
		}
	}, [props.isLogged, props.isLoggedId, props.isWorker, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrorMessage("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axios.post(
				`${API_BASE_URL}/worker/onboard`,
				{
					userId: props.isLoggedId,
					role: formData.role,
					qualifications: formData.qualifications || null,
					experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
					certifications: formData.certifications || null,
					availability_status: formData.availability_status
				}
			);

			if (response.data.message === "worker_onboarded") {
				navigate("/worker/dashboard");
			} else {
				setErrorMessage(response.data?.message || "Unable to complete onboarding.");
			}
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data?.message || "Unable to complete onboarding.");
			} else if (error.request) {
				setErrorMessage("The server did not respond.");
			} else {
				setErrorMessage(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const roleOptions = [
		"Service Technician",
		"AMC Coordinator",
		"Field Engineer",
		"Support Executive"
	];

	const availabilityOptions = [
		"Full-time",
		"Part-time",
		"On-call"
	];

	return (
		<div className="auth-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} isAdmin={props.isAdmin} isWorker={props.isWorker} userName={props.userName} />
			<main className="auth-shell">
				<aside className="auth-visual">
					<div className="auth-visual__title">
						<h1>Welcome to the Team</h1>
						<p>
							Complete your worker profile to get started. This information helps us match you with the right service requests and assignments.
						</p>
					</div>

					<div className="auth-points">
						<div className="auth-point">
							<div style={{ fontSize: "1.4rem", marginTop: "0.2rem" }}>✓</div>
							<div>
								<strong>Access assignments</strong>
								<span>View and manage your assigned service requests</span>
							</div>
						</div>
						<div className="auth-point">
							<div style={{ fontSize: "1.4rem", marginTop: "0.2rem" }}>✓</div>
							<div>
								<strong>Track progress</strong>
								<span>Monitor completion status and customer feedback</span>
							</div>
						</div>
						<div className="auth-point">
							<div style={{ fontSize: "1.4rem", marginTop: "0.2rem" }}>✓</div>
							<div>
								<strong>Build your profile</strong>
								<span>Showcase your qualifications and expertise</span>
							</div>
						</div>
					</div>
				</aside>

				<section className="auth-card">
					<div className="auth-card__top">
						<h2>Complete Your Profile</h2>
						<p>This information is only collected once. You can update it later in your settings.</p>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<div className="auth-field">
							<label className="auth-label" htmlFor="onboard-role">Primary Role</label>
							<div className="auth-input-wrap">
								<select
									className="auth-input"
									id="onboard-role"
									name="role"
									value={formData.role}
									onChange={handleChange}
									required
									style={{ paddingRight: "2.5rem" }}
								>
									{roleOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="onboard-experience">Years of Experience</label>
							<div className="auth-input-wrap">
								<input
									className="auth-input"
									id="onboard-experience"
									type="number"
									name="experience_years"
									placeholder="e.g., 5"
									min="0"
									max="60"
									value={formData.experience_years}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="onboard-qualifications">Qualifications</label>
							<div className="auth-input-wrap">
								<textarea
									className="auth-input"
									id="onboard-qualifications"
									name="qualifications"
									placeholder="e.g., BTech in Mechanical Engineering, HVAC Certification"
									rows="3"
									value={formData.qualifications}
									onChange={handleChange}
									style={{ paddingTop: "0.75rem", resize: "vertical" }}
								/>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="onboard-certifications">Certifications</label>
							<div className="auth-input-wrap">
								<textarea
									className="auth-input"
									id="onboard-certifications"
									name="certifications"
									placeholder="e.g., ISO 9001, Refrigerant Handling License"
									rows="2"
									value={formData.certifications}
									onChange={handleChange}
									style={{ paddingTop: "0.75rem", resize: "vertical" }}
								/>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="onboard-availability">Availability</label>
							<div className="auth-input-wrap">
								<select
									className="auth-input"
									id="onboard-availability"
									name="availability_status"
									value={formData.availability_status}
									onChange={handleChange}
									required
									style={{ paddingRight: "2.5rem" }}
								>
									{availabilityOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
						</div>

						<button
							type="submit"
							className="auth-submit"
							disabled={loading}
							style={{ marginTop: "0.5rem" }}
						>
							{loading ? "Completing Onboarding..." : "Complete Onboarding"}
						</button>

						{errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}
					</form>
				</section>
			</main>
		</div>
	);
}
