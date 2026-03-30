

import Header from "./Home/Header";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function Signup() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would normally handle signup logic
		navigate("/login");
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column"}}>
			<Header />
			<form className="form auth-form" onSubmit={handleSubmit} style={{ marginTop: 48, boxShadow: "0 4px 32px rgba(37,99,235,0.10)", background: "#fff" }}>
				<h2 className="form-title" style={{ color: "#2563eb" }}>Create account</h2>
				<p style={{ textAlign: "center", color: "#5c6678", marginBottom: 16 }}>
					Fill in the details below to create your account.
				</p>
				<label htmlFor="signup-name" style={{ color: "#b0b8c9", fontWeight: 600 }}>Full Name</label>
				<div style={{ position: "relative" }}>
					<FiUser style={{ position: "absolute", left: 12, top: 12, color: "#2563eb" }} />
					<input
						id="signup-name"
						type="text"
						placeholder="John Doe"
						required
						value={name}
						onChange={e => setName(e.target.value)}
						style={{ paddingLeft: 36, border: "1.5px solid #e0e7ef", borderRadius: 8, height: 38, background: "#f6f8fa", color: "#17304a", fontSize: 15, marginBottom: 8 }}
					/>
				</div>

				<label htmlFor="signup-email" style={{ color: "#b0b8c9", fontWeight: 600 }}>Email</label>
				<div style={{ position: "relative" }}>
					<FiMail style={{ position: "absolute", left: 12, top: 12, color: "#2563eb" }} />
					<input
						id="signup-email"
						type="email"
						placeholder="you@example.com"
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
						style={{ paddingLeft: 36, border: "1.5px solid #e0e7ef", borderRadius: 8, height: 38, background: "#f6f8fa", color: "#17304a", fontSize: 15, marginBottom: 8 }}
					/>
				</div>

				<label htmlFor="signup-password" style={{ color: "#b0b8c9", fontWeight: 600 }}>Password</label>
				<div style={{ position: "relative" }}>
					<FiLock style={{ position: "absolute", left: 12, top: 12, color: "#2563eb" }} />
					<input
						id="signup-password"
						type={showPassword ? "text" : "password"}
						placeholder="Create password"
						required
						value={password}
						onChange={e => setPassword(e.target.value)}
						style={{ paddingLeft: 36, border: "1.5px solid #e0e7ef", borderRadius: 8, height: 38, background: "#f6f8fa", color: "#17304a", fontSize: 15, marginBottom: 8 }}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? "Hide" : "Show"}
					</button>
				</div>

				<button type="submit" className="auth-btn" style={{ marginTop: 18, background: "linear-gradient(90deg, #2563eb, #1d4ed8)", fontWeight: 700, fontSize: 18 }}>
					Signup
				</button>
				<p style={{ textAlign: "center", marginTop: 18, color: "#555" }}>
					Already have an account? <a href="/login" style={{ color: "#2563eb", textDecoration: "underline" }}>Login</a>
				</p>
			</form>
		</div>
	);
}