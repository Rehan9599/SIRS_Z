
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import axios from "axios";
import Header from "../components/Header";

export default function Login(props) {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isUser, setIsUser]=useState(false);
	const [formData, setFormData]= useState({
		email:"",
		password:""
	});
	const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/login", {
					email: formData.email,
					password: formData.password
				}
			);
			console.log("Login success:", response.data);
			if(response.data.message=="yooooo"){
				props.setIsLogged(true);
			    navigate("/");
			}else{
				setFormData({
		        email:" ",
		        password:" "
	            });
				setIsUser(true);
				navigate("/login");
			}
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
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column"}}>
			<Header showAuth={props.isLogged} page="login"/>
			<form className="form auth-form" onSubmit={handleSubmit} style={{ marginTop: 48, boxShadow: "0 4px 32px rgba(37,99,235,0.10)", background: "#fff" }}>
				<h2 className="form-title" style={{ color: "#2563eb" }}>Welcome back</h2>
				<p style={{ textAlign: "center", color: "#5c6678", marginBottom: 16 }}>
					Please enter your credentials to sign in.
				</p>
				<label htmlFor="login-email" style={{ color: "#b0b8c9", fontWeight: 600 }}>Email</label>
				<div style={{ position: "relative" }}>
					<FiMail style={{ position: "absolute", left: 12, top: 12, color: "#2563eb" }} />
					<input
						id="login-email"
						type="email"
						name="email"
						placeholder="you@example.com"
						required
						onChange={handleChange}
						style={{ paddingLeft: 36, border: "1.5px solid #e0e7ef", borderRadius: 8, height: 38, background: "#f6f8fa", color: "#17304a", fontSize: 15, marginBottom: 8 }}
					/>
				</div>

				<label htmlFor="login-password" style={{ color: "#b0b8c9", fontWeight: 600 }}>Password</label>
				<div style={{ position: "relative" }}>
					<FiLock style={{ position: "absolute", left: 12, top: 12, color: "#2563eb" }} />
					<input
						id="login-password"
						name="password"
						type={showPassword ? "text" : "password"}
						placeholder="Enter password"
						required
						onChange={handleChange}
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
					Login
				</button>
				{isUser && 
				<p style={{ textAlign: "center", color: "red", marginBottom: 16 }}>
					user not found
				</p>
				}
				<p style={{ textAlign: "center", marginTop: 18, color: "#555" }}>
					Don&apos;t have an account? <a href="/signup" style={{ color: "#2563eb", textDecoration: "underline" }}>Sign up</a>
				</p>
			</form>
		</div>
	);
}
