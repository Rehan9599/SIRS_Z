import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home/home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Commercial from "./pages/Commercial";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const AUTH_STORAGE_KEY = "readycool-auth";

function readStoredAuth() {
	if (typeof window === "undefined") {
		return { isLogged: false, isLoggedId: null, userName: "" };
	}

	try {
		const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
		if (!rawValue) {
			return { isLogged: false, isLoggedId: null, userName: "" };
		}

		const parsedValue = JSON.parse(rawValue);
		return {
			isLogged: Boolean(parsedValue.isLogged),
			isLoggedId: parsedValue.isLoggedId ?? null,
			userName: parsedValue.userName || ""
		};
	} catch {
		return { isLogged: false, isLoggedId: null, userName: "" };
	}
}

export default function App() {
	const [isLogged, setIsLogged] = useState(false);
	const [isLoggedId, setIsLoggedId] = useState(null);
	const [userName, setUserName] = useState("");

	useEffect(() => {
		const storedAuth = readStoredAuth();
		setIsLogged(storedAuth.isLogged);
		setIsLoggedId(storedAuth.isLoggedId);
		setUserName(storedAuth.userName);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		if (isLogged) {
			window.localStorage.setItem(
				AUTH_STORAGE_KEY,
				JSON.stringify({ isLogged, isLoggedId, userName })
			);
		} else {
			window.localStorage.removeItem(AUTH_STORAGE_KEY);
		}
	}, [isLogged, isLoggedId, userName]);

	const handleLogout = () => {
		setIsLogged(false);
		setIsLoggedId(null);
		setUserName("");
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(AUTH_STORAGE_KEY);
		}
	};

	const sharedProps = {
		isLogged,
		isLoggedId,
		onLogout: handleLogout,
		userName
	};

	return (
		<Router>
			<main className="container">
				<Routes>
					<Route path="/" element={<Home {...sharedProps} />} />
					<Route path="/login" element={<Login setIsLogged={setIsLogged} setIsLoggedId={setIsLoggedId} setUserName={setUserName} onLogout={handleLogout} />} />
					<Route path="/signup" element={<Signup onLogout={handleLogout} />} />
					<Route path="/buy" element={<Buy {...sharedProps} />} />
					<Route path="/sell" element={<Sell {...sharedProps} />} />
					<Route path="/commercial" element={<Commercial {...sharedProps} />} />
					<Route path="/dashboard" element={<Dashboard {...sharedProps} />} />
					<Route path="/profile" element={<Profile {...sharedProps} onUpdateUserName={setUserName} />} />
				</Routes>
			</main>
		</Router>
	);
}
